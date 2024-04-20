import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLearnerComponent } from './add-learner/add-learner.component';
import { LearnersComponent } from './learners.component';
import { EnrolmentDetailsComponent } from './enrolment-details/enrolment-details.component';
import { EditEnrolmentComponent } from './enrolment-details/edit-enrolment/edit-enrolment.component';
import { LearnerOutcomeComponent } from './add-learner/learner-outcome/learner-outcome.component';
import { OutcomeListComponent } from './add-learner/learner-outcome/outcome-list/outcome-list.component';
import { AddOutcomeComponent } from './add-learner/learner-outcome/outcome-list/add-outcome/add-outcome.component';

import { ViewLearnerComponent } from './view-learner/view-learner.component';
import { AuthorizationGuard } from '../../framework/guards/authorization.guard';
import { ViewEnrolmentDetailsComponent } from './enrolment-details/view-enrolment-details/view-enrolment-details.component';
import { ViewOutcomeListComponent } from './add-learner/learner-outcome/outcome-list/view-outcome-list/view-outcome-list.component';

/** These components are for COMPLY/RMF learnes only 
 *  To hide these from CAPTR, feature id 50 (Programme-management) is used
 *  Learner is a service user feature with Id 9 */ 
const routes: Routes = [{
  path: '',
  canActivate: [AuthorizationGuard],
  component: LearnersComponent,
  data: { title: 'Learners', auth:[50]},
},
{
  path: 'new-learner',
  component: AddLearnerComponent,
  canActivate: [AuthorizationGuard],
  data: { title: 'Add Learner', auth:[50, 1]},
},
{
  path: 'edit-learner',
  component: AddLearnerComponent,
  canActivate: [AuthorizationGuard],
  data: { title: 'Edit Learner', auth:[50, 3]}
},
{
  path: 'learner-outcome',
  component: LearnerOutcomeComponent,
  data: { title: 'Employment Outcome' }
},
{
  path: 'view-learner',
  component: ViewLearnerComponent,
  canActivate: [AuthorizationGuard],
  data: { title: 'View Learner', auth:[50, 2]},
},
{
  path: 'enrolment-details',
  component: EnrolmentDetailsComponent,
  canActivate: [AuthorizationGuard],
  data: { title: 'Enrolment', auth:[50]},
},
{
  path: 'enrolment-details/edit-enrolment',
  component: EditEnrolmentComponent,
  canActivate: [AuthorizationGuard],
  data: { title: 'Edit Enrolment',  auth:[50, 1]},
},
{
  path: 'enrolment-details/view-enrolment-details',
  component: ViewEnrolmentDetailsComponent,
  canActivate: [AuthorizationGuard],
  data: { title: 'Edit Enrolment',  auth:[50, 1]},
},
{
  path: 'enrolment-details/edit-enrolment',
  component: EditEnrolmentComponent,
  data: { title: 'Edit Enrolment'},
},
{
  path: 'learner-outcome/outcome-list',
  component: OutcomeListComponent,
  data: { title: 'Outcome List'},
},
{
  path: 'learner-outcome/outcome-list/add-outcome',
  component: AddOutcomeComponent,
  data: { title: 'Add Outcome'},
},
{
  path: 'learner-outcome/outcome-list/edit-outcome',
  component: AddOutcomeComponent,
  data: { title: 'Edit Outcome'},
},
{
  path: 'learner-outcome/outcome-list/view-outcome-list',
  component: ViewOutcomeListComponent,
  data: { title: 'View Outcome'},
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnersRoutingModule { }
