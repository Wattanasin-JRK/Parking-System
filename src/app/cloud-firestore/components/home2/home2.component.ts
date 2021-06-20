import { Component, OnInit } from '@angular/core';
import { QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { IProduct } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.scss']
})
export class Home2Component implements OnInit {

  /** หัวข้อคอลัมน์ของ Table */
  displayedColumns = [
    'id',
    'name',
    'qty',
    'unit',
    'price',
    'created',
    'action'
  ];

  /** จำกัดขนาดของการแสดงข้อมูล */
  limit: number = 5;

  /** สำหรับเก็บข้อมูลการเรียงลำดับข้อมูล */
  sort: {
    column: string;
    type: 'asc' | 'desc';
    search?: string;
  };

  /** สำหรับเก็บข้อมูลการค้นหาข้อมูล  */
  search = { column: '', data: '' };

  /** รายการสินค้าเอาไปแสดงที่ Table */
  productItems: IProduct[] = [];

  /** เก็บข้อมูล doc ล่าสุดเอาไว้ทำ pagination */
  lastDocProduct!: QueryDocumentSnapshot<IProduct>;

  constructor(
    private service: ProductService,
    private app: AppService,
    private router: Router
  ) {
    this.sort = { column: 'created', type: 'desc' };
    this.search.column = this.sort.column;
    this.loadProducts();
  }

  ngOnInit(): void {
  }


  /** เมื่อมีการค้นหาข้อมูลโดยกดปุ่ม Search (แว่นขยาย) */
  onSearch() {
    this.sort.search = this.search.data;
    this.sort.column = this.search.column;
    this.sort.type = 'desc';
    this.loadProducts();
  }

  /** เมื่อมีการเปลี่ยนค่า Search column */
  onChangeSearchColumn(value: string) {
    this.search.column = value;
  }

  /** เมื่อมีการพิมพ์ข้อความ search data */
  onInputSeachData(value: string) {
    this.search.data = (value + "").trim();
  }

  /** ดักจับการคลิก Column เพื่อเรียงข้อมูล */
  async onSortData(sort: Sort) {
    const search = this.sort.search;
    this.sort = { column: sort.active, type: sort.direction as any, search };
    this.search.column = this.sort.column;
    if (!this.sort.type) this.sort = { column: 'created', type: 'desc', search };
    this.loadProducts();
  }

  /** ดักจับการเลื่อน scroll เพื่อโหลดข้อมูล */
  onScrollLoadData(ev: Event) {
    const elem = ev.target as HTMLDivElement;
    const { scrollTop, offsetHeight, scrollHeight } = elem;
    if ((scrollTop + offsetHeight) >= scrollHeight) {
      this.sharedLoadProducts()
        .startAfter(this.lastDocProduct)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length <= 0) return;
          this.lastDocProduct = querySnapshot.docs[querySnapshot.docs.length - 1];
          let index = this.productItems[this.productItems.length - 1].index + 1;
          querySnapshot.forEach(doc => {
            this.productItems = [...this.productItems, { ...doc.data(), id: doc.id, index: index++ }];
          });
        });
    }
  }

  /** ไปที่หน้าแก้ไขข้อมูล */
  onGoToUpdate(item: IProduct) {
    this.router.navigate(['/cloud-firestore/update', item.id]);
  }

  /** ลบข้อมูลสินค้า */
  async onDeleteProduct(item: IProduct) {
    const confirm = await this.app.confirm("Do you want to delete this right ?");
    if (!confirm) return;
    this.app.loading(true);
    this.service.getCollection
      .doc(item.id).delete()
      .then(() => {
        this.app.dialog('Delete successfully');
        this.loadProducts();
      })
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** โหลดข้อมูลสินค้า */
  private loadProducts() {
    this.sharedLoadProducts()
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length <= 0) {
          if (this.sort.search) this.productItems = [];
          return;
        }
        this.lastDocProduct = querySnapshot.docs[querySnapshot.docs.length - 1];
        this.productItems = [];
        let index = 1;
        querySnapshot.forEach(doc => {
          this.productItems.push({ ...doc.data(), id: doc.id, index: index++ });
        });
      });
  }

  /** แชร์โหลดข้อมูลสินค้า */
  private sharedLoadProducts() {
    let requestProduct = this.service.getCollection.ref
      .orderBy(this.sort.column, this.sort.type)
      .limit(this.limit);

    if (this.sort.search) {
      switch (this.sort.column) {
        // string type
        case 'name':
        case 'unit':
          requestProduct = requestProduct
            .where(this.sort.column, '>=', this.sort.search)
            .where(this.sort.column, '<=', this.sort.search + '~');
          break;
        // number type
        case 'qty':
        case 'price':
          requestProduct = requestProduct
            .where(this.sort.column, '>=', parseFloat(this.sort.search))
          break;
        case 'created':
          const date1 = new Date(this.sort.search);
          date1.setHours(0, 0, 0);
          const date2 = new Date(this.sort.search);
          date2.setHours(23, 59, 59);
          requestProduct = requestProduct
            .where(this.sort.column, '>=', date1)
            .where(this.sort.column, '<=', date2);
          break;
      }
    }

    return requestProduct;
  }

}
