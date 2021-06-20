import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  /** ฟอร์มข้อมูล */
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.createFormData();
  }

  ngOnInit(): void {
  }

  /** บันทึกข้อมูล (สมัครสมาชิก) */
  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.app.loading(true);
    this.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => this.router.navigate(['/']))
      .catch((error) => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** สร้างฟอร์มข้อมูล */
  private createFormData() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      cpassword: ['', [Validators.required, this.comparePasswordValid]]
    });
  }

  /** สร้าง custom validation ตรวจสอบ password และ cpassword ให้ตรงกัน */
  private comparePasswordValid(cpassword: AbstractControl) {
    const parent = cpassword.parent;
    if (!parent) return;
    const password = parent.get('password')!;
    const validationSubscription = password.valueChanges.subscribe(() => {
      cpassword.updateValueAndValidity();
      validationSubscription.unsubscribe();
    });
    if (!cpassword.value) return;
    if (cpassword.value === password.value) return;
    return { notComparePassword: true };
  }

}
