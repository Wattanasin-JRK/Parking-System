import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { AppService } from 'src/app/services/app.service';
import firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /** เก็บไฟล์อัพโหลด */
  fileItems: File[] = [];

  /** สร้าง image reference */
  imageRef: AngularFireStorageReference;

  /** สำหรับเก็บรูปภาพที่อัพโหลดแล้วใน Cloud storage */
  listImageItems: Array<firebase.storage.Reference & { url?: string; }> = [];

  constructor(
    private app: AppService,
    private storage: AngularFireStorage
  ) {
    this.imageRef = this.storage.ref('images');
    this.loadImageUploaded();
  }

  ngOnInit(): void {
  }

  /** ลบข้อมูลไฟล์ออกจาก Cloud Storage */
  async onDeleteFile(item: firebase.storage.Reference, index: number) {
    const confirm = await this.app.confirm('Do you want to delete this right?');
    if (!confirm) return;
    this.app.loading(true);
    item.delete()
      .then(() => {
        this.app.dialog('Delete successfully');
        this.listImageItems.splice(index, 1);
      })
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** ส่งข้อมูลไปบันทักใน Cloud Storage */
  onUploadFile(): any {
    if (this.fileItems.length <= 0) return this.app.dialog('Please choose file upload !');
    const fileUploads = this.fileItems.map(file => {
      const ref = this.imageRef.child(file.name) as AngularFireStorageReference;
      return ref.put(file);
    });
    this.app.loading(true);
    Promise.all(fileUploads)
      .then(results => {
        this.fileItems.splice(0);
        this.app.dialog('Upload successfully');
        results.forEach(async result => {
          const img = result.ref;
          if (this.listImageItems.find(m => m.name == img.name)) return;
          const url = await img.getDownloadURL();
          (img as any).url = url;
          this.listImageItems.push(img);
        });
      })
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false))
  }

  /** ลบข้อมูลไฟล์ออกจาก Input */
  onRemoveFile(index: number) {
    this.fileItems.splice(index, 1);
  }

  /** เมื่อเลือกไฟล์ที่จะอัพโหลด */
  onChangeFile(inputFIle: HTMLInputElement) {
    const { files } = inputFIle;
    if (files && files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        const file = files.item(index);
        if (!file) continue;
        this.fileItems.push(file);
      }
      inputFIle.value = '';
    }
  }

  /** ดึงข้อมูลรูปภาพที่อัพโหลดแล้วจาก Cloud Storage */
  private loadImageUploaded() {
    this.imageRef.listAll().subscribe(list => {
      this.listImageItems = [];
      list.items.forEach(async img => {
        const url = await img.getDownloadURL();
        (img as any).url = url;
        this.listImageItems.push(img);
      });
    });
  }

}
