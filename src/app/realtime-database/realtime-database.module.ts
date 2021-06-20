import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeDatabaseRoutingModule } from './realtime-database-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from '../shareds/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RealtimeDatabaseRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RealtimeDatabaseModule { }
