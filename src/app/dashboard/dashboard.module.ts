import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BoardComponent } from './component/board/board.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shareds/material-module';


@NgModule({
  declarations: [
    BoardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxChartsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
