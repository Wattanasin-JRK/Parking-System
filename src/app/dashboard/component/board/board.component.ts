import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { CarStats } from './data';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgModel, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  // view: any = [1600, 300];
  CarRef: AngularFireList<CarStats>;
  itemS : CarStats[] = [];
  form!: FormGroup;
  loadSubscription!: Subscription;
  panelOpenState = false;
  IR = 0;

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(    
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private app: AppService,
    private det: ChangeDetectorRef) {
    this.CarRef = this.db.list('/carcheck');
    this.loadData();
    this.createForm();
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.loadSubscription)
      this.loadSubscription.unsubscribe();
  }
  ngAfterContentChecked() {
    this.det.detectChanges();
}
    /** โหลดข้อมูลครั้งแรก */
    private loadData() {
      this.loadSubscription = this.CarRef.snapshotChanges().subscribe(res => {
        this.itemS = res.map(itemS => {
          return { id: itemS.key, ...itemS.payload.val() } as CarStats;
        }).sort((a, b) => b.created - a.created);
      });
    }

      /** สร้างฟอร์มข้อมูล */
  private async createForm() {
    const userLogin = await this.auth.currentUser;
    if (!userLogin) return;
    this.form = this.fb.group({
      // email: [userLogin.email],
      // licenseP: ['', Validators.required]
    });
  }

  async getCount(num: number) {
    return this.IR = this.itemS.filter(o => o.num === num).length;
  }

}
