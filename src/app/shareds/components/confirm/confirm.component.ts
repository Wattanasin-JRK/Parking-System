import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string
  ) { }

  ngOnInit(): void {
  }

  /** ดึงข้อมูล message data */
  get getMessageData() { return this.data; }

  /** ปิดหน้า Dialog */
  closeDialog(status: boolean) {
    this.dialogRef.close(status);
  }
}
