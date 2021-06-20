import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  /** ข้อมูลหน่วยสินค้า */
  unitItems: string[] = [];

  /** ฟอร์มข้อมูล */
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private app: AppService,
    private rt: Router,
    private dom: DomSanitizer
  ) {
    this.unitItems = this.service.getUnitItems();
    this.createForm();
  }

  ngOnInit(): void {
  }

  /** แปลงข้อมูล File Input เป็น URL */
  get getFileUpload() {
    const imageForm = this.form.get('image');
    if (!imageForm) return;
    if (!imageForm.value) return;
    const file = imageForm.value as File;
    return this.dom.bypassSecurityTrustUrl(URL.createObjectURL(file));
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
      .saveCollection(this.form.value)
      .then(() => {
        this.app.dialog('Add product successfully');
        this.rt.navigate(['/cloud-firestore']);
      })
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** สร้างฟอร์มข้อมูล */
  private createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      qty: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      image: ['']
    });
  }

}
