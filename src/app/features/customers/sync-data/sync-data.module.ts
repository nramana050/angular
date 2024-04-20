import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SyncDataRoutingModule } from './sync-data-routing.module';
import { SyncDataComponent } from './sync-data.component';

@NgModule({
  declarations: [SyncDataComponent],
  imports: [
    CommonModule,
    SyncDataRoutingModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    MatCardModule,
    MatButtonModule
  ]
})
export class SyncDataModule { }
