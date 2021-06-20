import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageRoutingModule } from './storage-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from '../shareds/material-module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    StorageRoutingModule,
    MaterialModule
  ]
})
export class StorageModule { }
