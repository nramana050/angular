import { TrackLiteSyncDataComponent } from './track-lite-sync-data.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TrackLiteSyncDataComponent,
    data: { title: 'Track Lite Sync Data', auth: [12] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackLiteSyncDataRoutingModule { }
