import { SyncDataComponent } from './sync-data.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SyncDataComponent,
    data: { title: 'Sync Data', auth: [12] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SyncDataRoutingModule { }
