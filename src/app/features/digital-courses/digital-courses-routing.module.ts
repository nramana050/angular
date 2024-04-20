import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalCoursesComponent } from './digital-courses.component';
import { AuthorizationGuard } from 'src/app/framework/guards/authorization.guard';
import { CourseLaunchComponent } from '../captr-learners/view-captr-learner/participant-learning/digital-course-progress/course-launch/course-launch.component';
import { EnrollLearnerComponent } from './enroll-learner/enroll-learner.component';

const routes: Routes = [
  {
    path: '',
    component: DigitalCoursesComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Digital courses', auth: [86]}
  },

  {
    path: 'courseLaunch/:courseId',
    component: CourseLaunchComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Digital course' , auth:[86]},
  }, 
  {
    path: 'enroll-learner',
    component: EnrollLearnerComponent,
    data: { auth: [86,1] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalCoursesRoutingModule { }
