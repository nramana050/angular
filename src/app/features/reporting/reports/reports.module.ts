import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/framework/material/material.module';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReportsRoutingModule,
    ReactiveFormsModule
  ]
})
export class ReportsModule { }
