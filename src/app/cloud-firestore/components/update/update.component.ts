import { Component, OnInit } from '@angular/core';
import { AngularFireStorageReference } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  /** ข้อมูลหน่วยสินค้า */
  unitItems: string[] = [];

  /** ฟอร์มข้อมูล */
  form!: FormGroup;

  /** ข้อมูลรหัสสินค้าเอาไว้แก้ไข */
  productId: string;

  /** เอาไว้เก็บชื่อไว้แสดงหัวข้อฟอร์ม */
  productName!: string;

  /** เอาไว้เก็บลิงค์ของรูปภาพไปแสดงที่ตัวอย่างภาพอัพโหลด */
  productImage!: string;

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private app: AppService,
    private rt: Router,
    private act: ActivatedRoute,
    private dom: DomSanitizer
  ) {
    this.productId = this.act.snapshot.params.id;
    this.unitItems = this.service.getUnitItems();
    this.createForm();
  }

  ngOnInit(): void {
  }

  /** แปลงข้อมูล File Input เป็น URL */
  get getFileUpload() {
    const imageForm = this.form.get('image');
    if (imageForm && imageForm.value) {
      const file = imageForm.value as File;
      return this.dom.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
    else if (this.productImage) return this.productImage;
    else return;
  }

  /** เมื่อเลือกไฟล์อัพโหลด */
  onChangeFile(input: HTMLInputElement) {
    const imageForm = this.form.get('image');
    if (!imageForm) return;
    const { files } = input;
    if (files && files.length > 0) {
      const file = files[0];
      imageForm.setValue(file);
    }
  }

  /** บันทึกข้อมูล */
  onSubmit() {
    if (this.form.invalid) return;
    this.app.loading(true);
    this.service
      .updateCollection(this.productId, this.form.value)
      .then(() => {
        this.app.dialog('Update product successfully');
        this.rt.navigate(['/cloud-firestore']);
      })
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** สร้างฟอร์มข้อมูล */
  private async createForm() {
    try {
      this.app.loading(true);
      const doc = await this.service.getCollection.doc(this.productId).get().toPromise();
      const data = doc.data();
      if (!doc.exists || !data) throw new Error('Not found document !');
      this.productName = data.name;
      this.form = this.fb.group({
        name: [data.name, Validators.required],
        qty: [data.qty, [Validators.required, Validators.min(0)]],
        unit: [data.unit, Validators.required],
        price: [data.price, [Validators.required, Validators.min(0)]],
        description: [data.description],
        image: ['']
      });
      if (!data.image) return;
      const ref = this.service.getStorage.child(data.image) as AngularFireStorageReference;
      this.productImage = await ref.getDownloadURL().toPromise();
    }
    catch (error) {
      this.app.dialog(error.message);
      this.rt.navigate(['/cloud-firestore']);
    }
    finally {
      this.app.loading(false)
    }
  }

}
