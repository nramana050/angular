import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantV6Component } from './participant-v6.component';
import { ParticipantV6RoutingModule } from './participant-v6-routing.module';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { AddEditParticipantV6Component } from './add-edit-participant-v6/add-edit-participant-v6.component';
import { ViewProfileComponent } from './view-participant-v6/view-profile/view-profile.component';
import { ParticipantProfessionalViewComponent } from './participant-professional-view/participant-professional-view.component';
import { SessionsService } from '../shared/services/sessions.service';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { LearnerNavigation } from '../captr-learners/view-captr-learner/learner-nav';
import { AppConfirmModule } from 'src/app/framework/components/app-confirm/app-confirm.module';
import { FormControlModule } from '../shared/components/form-control/form-control.module';
import { TrackTabService } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { DocumentsService } from '../captr-learners/view-captr-learner/documents/documents.service';
import { LearnersModule } from '../learners/learners.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompleteAssessmentsComponent } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments.component';
import { CompleteAssessmentsTabsComponent } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments-tabs/complete-assessments-tabs.component';
import { CompleteAssessmentsService } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments.service';




@NgModule({
  declarations: [
    ParticipantV6Component,
    AddEditParticipantV6Component,
    ViewProfileComponent,
    ParticipantProfessionalViewComponent,
  ],
  imports: [
    CommonModule,
    ParticipantV6RoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    FilterPipeModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    SharedModule,
    LearnersModule, 
  ],
  providers:[
    CommonModule,    
    MaterialModule,
    SessionsService,
    AppConfirmModule,
    SharedModule,
    FormControlModule,
    CommonModule,
    FilterPipeModule,
    SessionsService,
    DocumentsService,
    TrackTabService,
    LearnerNavigation,
    CompleteAssessmentsService 
],
})
export class ParticipantV6Module { }
