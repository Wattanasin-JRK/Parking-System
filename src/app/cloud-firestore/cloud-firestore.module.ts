import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudFirestoreRoutingModule } from './cloud-firestore-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from '../shareds/material-module';
import { CreateComponent } from './components/create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateComponent } from './components/update/update.component';
import { Home2Component } from './components/home2/home2.component';

@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    UpdateComponent,
    Home2Component
  ],
  imports: [
    CommonModule,
    CloudFirestoreRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CloudFirestoreModule { }
