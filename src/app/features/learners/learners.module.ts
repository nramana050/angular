import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LearnersRoutingModule } from './learners-routing.module';
import { AddLearnerComponent } from './add-learner/add-learner.component';
import { MaterialModule } from '../../framework/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { AppConfirmModule } from '../../framework/components/app-confirm/app-confirm.module';
import { SharedModule } from '../../framework/shared/shared.module';
import { FeatureAllowModule } from '../shared/components/directives/features-allow.module';
import { MatRadioModule } from '@angular/material/radio';
import { EnrolmentDetailsComponent } from './enrolment-details/enrolment-details.component';
import { EditLeanerSteps } from './add-learner/edit-learner.steps';
import { EditEnrolmentComponent } from './enrolment-details/edit-enrolment/edit-enrolment.component';
import { LearnerOutcomeComponent } from './add-learner/learner-outcome/learner-outcome.component';
import { OutcomeListComponent } from './add-learner/learner-outcome/outcome-list/outcome-list.component';
import { AddOutcomeComponent } from './add-learner/learner-outcome/outcome-list/add-outcome/add-outcome.component';
import { FileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { ViewLearnerComponent } from './view-learner/view-learner.component';
import { EditCaptrLeanerSteps } from '../captr-learners/add-captr-learner/edit-captr-learner.steps';
import { ViewEnrolmentDetailsComponent } from './enrolment-details/view-enrolment-details/view-enrolment-details.component';
import { ViewOutcomeListComponent } from './add-learner/learner-outcome/outcome-list/view-outcome-list/view-outcome-list.component';
import { ViewLernerStapes } from './view-learner/view-lerner-stapes';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import {EditMentivityLeanerSteps } from  '../mentivity-learners/add-mentivity-learners/edit-mentivity-learner.steps';

@NgModule({
  declarations: [
    AddLearnerComponent,
    ViewLearnerComponent,
    EnrolmentDetailsComponent,
    EditEnrolmentComponent,
    LearnerOutcomeComponent,
    OutcomeListComponent,
    AddOutcomeComponent,
    ViewEnrolmentDetailsComponent,
    ViewOutcomeListComponent,
    
  ],
  imports: [
    CommonModule,
    LearnersRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    AppConfirmModule,
    FeatureAllowModule,
    MatTabsModule,
    MatButtonToggleModule,
    SharedModule,
    MatRadioModule,
    FileUploadModule,
    FilterPipeModule
  ],
  providers :[
    EditLeanerSteps,
    ViewLernerStapes,
    EditCaptrLeanerSteps,
    DatePipe,
    EditMentivityLeanerSteps,
  ]
})
export class LearnersModule { }
