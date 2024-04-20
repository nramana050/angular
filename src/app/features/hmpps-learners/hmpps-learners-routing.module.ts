import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HmppsLearnersComponent } from './hmpps-learners.component';
import { AuthorizationGuard } from 'src/app/framework/guards/authorization.guard';
import { AddHmppsLearnerComponent } from './add-hmpps-learner/add-hmpps-learner.component';

const routes: Routes = [
  {
    path: '',
    component: HmppsLearnersComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '' , auth:[9]},
  },
  {
    path: 'new',
    component: AddHmppsLearnerComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Add Participant' , auth:[9,1]},
  },

  {
    path: 'edit',
    component: AddHmppsLearnerComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Add Participant' , auth:[9,1]},
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HmppsLearnersRoutingModule { }
