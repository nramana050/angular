import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../framework/material/material.module';
import { DigitalCoursesRoutingModule } from './digital-courses-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnrollLearnerComponent } from './enroll-learner/enroll-learner.component';


@NgModule({
  declarations: [EnrollLearnerComponent],
  imports: [
    CommonModule,
    DigitalCoursesRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
  ]
})
export class DigitalCoursesModule { }
