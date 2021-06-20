import { NgModule } from '@angular/core';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { Routes, RouterModule } from '@angular/router';
import { redirectEmailVerified } from '../guards/redirect-email-verify.guard';
import { CreateComponent } from './components/create/create.component';
import { HomeComponent } from './components/home/home.component';
import { Home2Component } from './components/home2/home2.component';
import { UpdateComponent } from './components/update/update.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectEmailVerified(['/authentication/signin']) }
  },
  {
    path: 'home2', component: Home2Component,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectEmailVerified(['/authentication/signin']) }
  },
  {
    path: 'create', component: CreateComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectEmailVerified(['/authentication/signin']) }
  },
  {
    path: 'update/:id', component: UpdateComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectEmailVerified(['/authentication/signin']) }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloudFirestoreRoutingModule { }
