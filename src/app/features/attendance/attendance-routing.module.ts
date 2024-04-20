import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from '../../framework/guards/authorization.guard';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { AttendanceSessionComponent } from './attendance-session/attendance-session.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { ProgrammeAttendanceComponent } from './programme-attendance/programme-attendance.component';
import { ViewAttendanceSessionComponent } from './view-attendance-session/view-attendance-session.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: ProgrammeAttendanceComponent,
      canActivate:[AuthorizationGuard],
      data: { title: 'Programme', breadcrumb: '', preload: false, auth: [1] },
    },
    {
      path: 'list',
      component: MarkAttendanceComponent,
      canActivate:[AuthorizationGuard],
      data: { title: 'Date', breadcrumb: '', preload: false, auth: [1], preserveParam: ['day'] },
      children: [
        {
          path: '',
          component: AttendanceListComponent,
          canActivate:[AuthorizationGuard],
          data: { title: 'Date', breadcrumb: '', preload: false, auth: [1] },
        },
        {
          path : 'session',
          component : AttendanceSessionComponent,
          canActivate:[AuthorizationGuard],
          // canDeactivate: [CanDeactivateGuard],
          data: { title: 'Sessions', breadcrumb: '', preload: false, auth: [1]}
        },
        {
          path : 'view-session',
          component : ViewAttendanceSessionComponent,
          canActivate:[AuthorizationGuard],
          // canDeactivate: [CanDeactivateGuard],
          data: { title: 'View Sessions', breadcrumb: '', preload: false, auth: [1]}
        },
      
      ]
    },

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
