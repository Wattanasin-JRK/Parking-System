import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./dashboard/dashboard.module')
  //     .then(m => m.DashboardModule)
  // },
  {
    path: '',
    loadChildren: () => import('./main/main.module')
      .then(m => m.MainModule)
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module')
      .then(m => m.AuthenticationModule)
  },
  {
    path: 'realtime-database',
    loadChildren: () => import('./realtime-database/realtime-database.module')
      .then(m => m.RealtimeDatabaseModule)
  },
  {
    path: 'cloud-firestore',
    loadChildren: () => import('./cloud-firestore/cloud-firestore.module')
      .then(m => m.CloudFirestoreModule)
  },
  {
    path: 'storage',
    loadChildren: () => import('./storage/storage.module')
      .then(m => m.StorageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
