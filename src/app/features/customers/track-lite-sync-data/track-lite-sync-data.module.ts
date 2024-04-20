import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackLiteSyncDataComponent } from './track-lite-sync-data.component';
import { TrackLiteSyncDataRoutingModule } from './track-lite-sync-data-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TrackLiteSyncDataRoutingModule,
    MatCardModule,
    MatButtonModule
  ],
  declarations: [TrackLiteSyncDataComponent],
  exports: [
    MatCardModule,
    MatButtonModule
  ]
})
export class TrackLiteSyncDataModule { }
