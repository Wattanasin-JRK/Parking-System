import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorageReference } from '@angular/fire/storage';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { IProduct } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  /** หัวข้อคอลัมน์ของ Table */
  displayedColumns = [
    'id',
    'name',
    'qty',
    'unit',
    'price',
    'action'
  ];

  /** สำหรับเป็นข้อมูลของ p-table (รายการสินค้าเอาไปแสดงที่ Table ) */
  dataSource = new MatTableDataSource<IProduct>([]);

  /** สำหรับตรวจจับ Element mat-paginator */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** สำหรับตรวจจับ Element mat-sort ที่ติดอยู่กับ p-table */
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: ProductService,
    private app: AppService,
    private router: Router
  ) {
    this.loadProducts();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** ค้นหาข้อมูล */
  applyFilter(input: HTMLInputElement) {
    const filterValue = input.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
    this.service.deleteCollection(item.id)
      .then(() => {
        this.app.dialog('Delete successfully');
        this.loadProducts();
      })
      .catch(error => this.app.dialog(error.message))
      .finally(() => this.app.loading(false));
  }

  /** โหลดข้อมูลสินค้า */
  private loadProducts() {
    this.service.getCollection.get().subscribe((querySnapshot) => {
      this.dataSource.data = [];
      querySnapshot.forEach(doc => {
        const data = { ...doc.data(), id: doc.id };
        if (data.image) {
          const ref = this.service.getStorage.child(data.image) as AngularFireStorageReference;
          data.image = ref.getDownloadURL();
        }
        this.dataSource.data.push(data);
      });
      this.dataSource.data
        .sort((a, b) => b.created.seconds - a.created.seconds)
        .map((m, index) => m.index = index + 1);
      this.dataSource._updateChangeSubscription();
    });
  }

}
