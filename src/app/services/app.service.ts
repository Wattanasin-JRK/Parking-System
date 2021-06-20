import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { ConfirmComponent } from '../shareds/components/confirm/confirm.component';

@Injectable({ providedIn: 'root' })
export class AppService {

  /** สำหรับดักจับการเปิด ปิด Loading */
  private loadingSubject: Subject<boolean>;

  constructor(
    private matSnackbar: MatSnackBar,
    private matDialog: MatDialog
  ) {
    this.loadingSubject = new Subject<boolean>();
  }

  /** ดึงข้อมูล Subject */
  get getLoading() { return this.loadingSubject; }

  /** ใช้งาน Loading */
  loading(status: boolean) {
    this.loadingSubject.next(status);
  }

  /** Dialog แจ้งเตือน */
  dialog(message: string) {
    return this.matSnackbar.open(message, 'Close', {
      duration: 3000
    });
  }

  /** Dialog ยืนยันการทำรายการ */
  confirm(message: string) {
    return this.matDialog.open(ConfirmComponent, {
      width: '280px',
      data: message,
      disableClose: true
    }).afterClosed().toPromise<boolean>();
  }
}
