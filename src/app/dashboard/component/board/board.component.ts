import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { single } from './data';
// import { Refer } from './Ref';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  single: any;
  view: any = [1600, 300];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(    
    private db: AngularFireDatabase,
    private det: ChangeDetectorRef) {
    Object.assign(this, { single });
  }
  
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
  }

  
}

// export class BoardComponent {
//   itemRef: AngularFireObject<any>;
//   item: Observable<any>;
//   constructor(db: AngularFireDatabase) {
//     this.itemRef = db.object('item');
//     this.item = this.itemRef.valueChanges();
//   }
//   save(newName: string) {
//     this.itemRef.set({ name: newName });
//   }
//   update(newSize: string) {
//     this.itemRef.update({ size: newSize });
//   }
//   delete() {
//     this.itemRef.remove();
//   }
// }