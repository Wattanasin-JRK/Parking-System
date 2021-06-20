import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private db: AngularFirestore,
    private st: AngularFireStorage
  ) { }

  /** ข้อมูลหน่วยสินค้า */
  getUnitItems() {
    return [
      'Kilo-gram',
      'Gram',
      'Pair',
      'Metre',
      'Box'
    ];
  }

  /** ส่วนของ product collection */
  get getCollection() { return this.db.collection<IProduct>('products'); }

  /** ส่วนของ product storage */
  get getStorage() { return this.st.ref('firestore-images'); }

  /** ลบข้อมูล doc ออกจาก collection */
  async deleteCollection(id: string): Promise<void> {
    const product = (await this.getCollection.doc(id).get().toPromise()).data();
    if (!product) return Promise.reject({ message: 'Not found product' });
    await this.getCollection.doc(id).delete();
    if (product.image) await this.getStorage.child(product.image).delete().toPromise();
  }

  /** บันทึกข้อมูลเข้าสู่ collection */
  async saveCollection(data: any) {
    data.created = new Date();
    data.updated = new Date();
    const img = data.image as File;
    if (img) {
      const ref = this.getStorage.child(img.name) as AngularFireStorageReference;
      const upload = await ref.put(img);
      data.image = upload.metadata.name;
    }
    return this.getCollection.add(data);
  }

  /** แก้ไขข้อมูลจาก collection */
  async updateCollection(id: string, data: any) {
    const product = (await this.getCollection.doc(id).get().toPromise()).data();
    if (!product) return Promise.reject({ message: 'Not found product' });
    const img = data.image as File;
    if (img) {
      const ref = this.getStorage.child(img.name) as AngularFireStorageReference;
      const upload = await ref.put(img);
      data.image = upload.metadata.name;
      if (product.image) this.getStorage.child(product.image).delete().subscribe();
    }
    else data.image = product.image;
    data.updated = new Date();
    return this.getCollection.doc(id).update(data);
  }
}
