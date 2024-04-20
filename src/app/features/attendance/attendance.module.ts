import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { ProgrammeAttendanceComponent } from './programme-attendance/programme-attendance.component';
import { AttendanceSessionComponent } from './attendance-session/attendance-session.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { ManageUsersModule } from '../manage-users/manage-users.module';
import { AttendanceService } from './attendance.service';
import { AttendanceSteps } from './attendance.steps';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { ViewAttendanceSessionComponent } from './view-attendance-session/view-attendance-session.component';


@NgModule({
  declarations: [
    ProgrammeAttendanceComponent,
    AttendanceSessionComponent,
    MarkAttendanceComponent,
    AttendanceListComponent,
    ViewAttendanceSessionComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    MaterialModule,
    ManageUsersModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FilterPipeModule
  ],
  providers: [
    AttendanceSteps,
    AttendanceService
  ]
})
export class AttendanceModule { }
