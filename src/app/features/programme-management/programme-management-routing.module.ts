import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProgrammeDeliveryComponent } from './programme-delivery/programme-delivery.component';
import { ProgrammeManagementComponent } from './programme-management.component';
import { ProgrammesComponent } from './programmes/programmes.component';
import { AddProgrammeComponent } from './programmes/add-programme/add-programme.component';
import { AddProgrammeDeliveryComponent } from './programme-delivery/add-programme-delivery/add-programme-delivery.component';
import { ProgressCompletionComponent } from './programme-delivery/progress-completion/progress-completion.component';
import { WithdrawalsComponent } from './programme-delivery/withdrawals/withdrawals.component';
import { AuthorizationGuard } from '../../../app/framework/guards/authorization.guard';
import { ViewProgrammeDeliveryComponent } from './programme-delivery/view-programme-delivery/view-programme-delivery.component';
import { ViewProgrammeComponent } from './programmes/view-programme/view-programme.component';
import { ViewProgressCompletionComponent } from './programme-delivery/progress-completion/view-progress-completion/view-progress-completion.component';
import { ProgrammeDeatailsComponent } from './programme-delivery/progress-completion/view-progress-completion/programme-deatails/programme-deatails.component';
import { ProgressCompletionsComponent } from './programme-delivery/progress-completion/view-progress-completion/progress-completions/progress-completions.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

const routes: Routes = [
  {
    path: '',
    component: ProgrammeManagementComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '', auth:[50]},
    redirectTo: 'programmes',
    pathMatch: 'full'
  },
  {
    path: 'programmes',
    canActivate: [AuthorizationGuard],
    component: ProgrammesComponent,
    data: { title: '', auth:[50] }
  },
  {
    path: 'programmes/add',
    component: AddProgrammeComponent, 
    canActivate: [AuthorizationGuard],
    data: { title: 'Add programme', auth:[50, 1], identifier:PageTitleIdentifier.Add_programme}
  },
  {
    path: 'programmes/view',
    component: ViewProgrammeComponent, 
    canActivate: [AuthorizationGuard],
    data: { title: 'View Programme', auth:[50, 1], identifier:PageTitleIdentifier.View_Programme}
  },
  {
    path: 'programmes/edit/:id',
    component: AddProgrammeComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Edit programme', auth:[50, 2], identifier:PageTitleIdentifier.Edit_programme}
  },
  {
    path: 'programme-delivery',
    component: ProgrammeDeliveryComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '',  auth:[50] }
  },
  {
    path: 'programme-delivery/add-pd',
    component: AddProgrammeDeliveryComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '', auth:[50,1] }
  },
  {
    path: 'programme-delivery/edit-pd',
    component: AddProgrammeDeliveryComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '',  auth:[50, 3] }
  },
  {
    path: 'programme-delivery/progress-completion',
    component: ProgressCompletionComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '' , auth:[50] }
  },
  {
    path: 'programme-delivery/withdrawals',
    component: WithdrawalsComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '', auth:[50] }
  },
  {
    path: 'programme-delivery/view-pd',
    component: ViewProgrammeDeliveryComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '',  auth:[50, 2] }
  },
  {
    path: 'programme-delivery/view-progress-completion/course-details',
    component: ProgressCompletionsComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '' , auth:[50] }
  },
  {
    path: 'programme-delivery/view-withdrawals',
    component: WithdrawalsComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '',  auth:[50] }
  },
  {
    path: 'programme-delivery/view-progress-completion/programme-details',
    component: ProgrammeDeatailsComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '' , auth:[50] }
  },
  {
    path: 'programme-delivery/view-progress-completion',
    component: ViewProgressCompletionComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '' , auth:[50] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgrammeManagementRoutingModule { }
