import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompleteAssessmentsComponent } from './complete-assessments.component';
import { CompleteAssessmentComponent } from './complete-assessment/complete-assessment.component';

export const CompleteAssessmentRoutes: Routes = [
  { path: '', component: CompleteAssessmentsComponent, data: { title: 'My Assessments', auth: [2]} },
  { path: ':assessmentTemplateId', component: CompleteAssessmentComponent, data: { title: 'Complete Assessment', auth: [2]} },
];


