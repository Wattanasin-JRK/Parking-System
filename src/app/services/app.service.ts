import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private snackbar: MatSnackBar) { }

  /* Dialog แจ้งเตือน */
  dialog(message: string) {
    this.snackbar.open(message, 'ปิดหน้านี้', {
      duration: 3000
    })
  }
}
