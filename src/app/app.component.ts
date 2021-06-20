import { Component } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Parking-System';
  constructor(private app: AppService) {
  }

  /** ดึงข้อมูล Loading page */
  get loading() { return this.app.getLoading; }
}
