import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

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

  /** ส่งข้อมูล */
  onSubmit() {
    if (this.form.invalid) return;
    const { email } = this.form.value;
    this.app.loading(true);
    this.auth
      .sendPasswordResetEmail(email)
      .then(() => this.router.navigate(['/authentication/signin']))
      .catch(err => this.app.dialog(err.message))
      .finally(() => this.app.loading(false));
  }

  /** สร้างฟอร์มข้อมูล */
  private createFormData() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

}
