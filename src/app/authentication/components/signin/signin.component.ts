import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import firebase from 'firebase/app';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

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

  /** เข้าสู่ระบบผ่านบัญชี Google */
  onSigninWithGmail() {
    var provider = new firebase.auth.GoogleAuthProvider();
    this.app.loading(true);
    this.auth
      .signInWithPopup(provider)
      .then(() => this.router.navigate(['/']))
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** เข้าสู่ระบบ */
  onSubmit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.app.loading(true);
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => this.router.navigate(['/']))
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** สร้างฟอร์มข้อมูล */
  private createFormData() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

}
