import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgrammesRoutingModule } from './programmes-routing.module';
import { MaterialModule } from '../../../framework/material/material.module';
import { SharedModule } from '../../../framework/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewProgrammeComponent } from './view-programme/view-programme.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ProgrammesRoutingModule
  ]
})
export class ProgrammesModule { }
