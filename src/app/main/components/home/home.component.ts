import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  /** ข้อมูลผู้ใช้งานที่เข้าสู่ระบบ */
  userLogin!: firebase.User;

  constructor(
    private app: AppService,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.loadUserLogin();
  }

  ngOnDestroy() {
  }

  ngOnInit(): void {
  }

  /** ออกจากระบบ */
  onSignout() {
    this.app.loading(true);
    this.auth.signOut()
      .then(() => {
        this.app.dialog('Signout successfully');
        this.router.navigate(['/authentication/signin']);
      })
      .catch(err => this.app.dialog(err.message))
      .finally(() => this.app.loading(false));
  }

  /** ยืนยัน email */
  onVerifyEmail() {
    this.app.loading(true);
    this.userLogin.sendEmailVerification()
      .then(() => this.app.dialog('Email has send.'))
      .catch(err => this.app.dialog(err.message))
      .finally(() => this.app.loading(false))
  }

  /** โหลดข้อมูล User login */
  private loadUserLogin() {
    this.auth.user.subscribe(user => {
      if (user) this.userLogin = user;
    });
  }
}
