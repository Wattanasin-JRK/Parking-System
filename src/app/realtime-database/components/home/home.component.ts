import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { FormBuilder, FormGroup, FormGroupDirective, NgModel, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { IMessaging } from '../../interfaces/messaging.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  /** ข้อมูล messaging list item */
  messagingRef: AngularFireList<IMessaging>;

  /** ข้อมูล messaging */
  items: IMessaging[] = [];

  /** ฟอร์มข้อมูล */
  form!: FormGroup;

  /** สำหรับเคลียร์ Memory การโหลดข้อมูล */
  loadSubscription!: Subscription;

  constructor(
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private app: AppService,
    private det: ChangeDetectorRef
  ) {
    this.messagingRef = this.db.list('/LicenseDB');
    this.loadData();
    this.createForm();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.loadSubscription)
      this.loadSubscription.unsubscribe();
  }

  /** บันทึกข้อมูล */
  onSubmit(f: FormGroupDirective) {
    if (this.form.invalid) return;
    const data = {
      ...this.form.value,
      // created: new Date().getTime(),
      // updated: new Date().getTime()
    };
    this.app.loading(true);
    this.messagingRef.push(data)
      .then(() => {
        this.app.dialog('Successfully');
        this.form.controls['licenseP'].reset();
        f.resetForm(this.form.value);
      })
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** ลบข้อมูล */
  async onDelete(item: IMessaging) {
    const confirm = await this.app.confirm('Do you want to delete this right?');
    if (!confirm) return;
    this.app.loading(true);
    this.messagingRef.remove(item.id)
      .then(() => this.app.dialog('Delete successfully'))
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** แสดงข้อมูลก่อนแก้ไข */
  onShowEdit(item: IMessaging) {
    this.items.forEach(m => m.active = false);
    item.active = true;
  }

  /** แก้ไขข้อมูล */
  onEdit(item: IMessaging, model: NgModel) {
    if (model.invalid) return;
    this.app.loading(true);
    this.messagingRef
      .update(item.id, {
        licenseP: model.value,
        updated: new Date().getTime()
      })
      .then(() => {
        this.app.dialog('Update successfully');
        item.active = false;
      })
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** โหลดข้อมูลครั้งแรก */
  private loadData() {
    // this.messagingRef.query.orderByChild('updated').limitToFirst(2).on('value', value => {
    //   const items: any[] = [];
    //   value.forEach(item => {
    //     items.push({ id: item.key, ...item.val() } as IMessaging);
    //   });
    //   this.items = items;
    //   this.det.detectChanges();
    //   console.log(this.items);
    // });
    this.loadSubscription = this.messagingRef.snapshotChanges().subscribe(res => {
      this.items = res.map(item => {
        return { id: item.key, ...item.payload.val() } as IMessaging;
      }).sort((a, b) => b.created - a.created);
    });
  }

  /** สร้างฟอร์มข้อมูล */
  private async createForm() {
    const userLogin = await this.auth.currentUser;
    if (!userLogin) return;
    this.form = this.fb.group({
      // email: [userLogin.email],
      licenseP: ['', Validators.required]
    });
  }
}
