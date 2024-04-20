import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ParticipantV2RoutingModule } from './participant-v2-routing.module';
import { ParticipantV2Component } from './participant-v2.component';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { AppConfirmModule } from 'src/app/framework/components/app-confirm/app-confirm.module';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { ConfirmBoxModule } from '../shared/components/confirm-box/confirm-box.module';
import { FeatureAllowModule } from '../shared/components/directives/features-allow.module';
import { FileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { FormControlModule } from '../shared/components/form-control/form-control.module';
import { MatSelectSearchModule } from '../shared/components/mat-select-search/mat-select-search.module';
import { AddParticipantComponent } from './add-participant/add-participant.component';
import { ViewParticipantComponent } from './view-participant/view-participant.component';
import { AddCommentModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-comment-modal/add-comment-modal.component';
import { AddInterventionModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-intervention-modal/add-intervention-modal.component';
import { AddOrEditAppointmentModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-or-edit-appointment-modal/add-or-edit-appointment-modal.component';
import { EditInterventionModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/edit-intervention-modal/edit-intervention-modal.component';
import { SelectAnActivityModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/select-an-activity-modal/select-an-activity-modal.component';
import { EditParticipantSteps } from './add-participant/edit-participant-learner.steps';
import { AddCaptrLearnerModule } from '../captr-learners/add-captr-learner/add-captr-learner.module';
import { EditCaptrLeanerSteps } from '../captr-learners/add-captr-learner/edit-captr-learner.steps';
import { LearnerNavigation } from '../captr-learners/view-captr-learner/learner-nav';
import { TrackTabService } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { EditLeanerSteps } from '../learners/add-learner/edit-learner.steps';
import { SessionsService } from '../shared/services/sessions.service';
import { ParticipantNavigation } from './view-participant/participant-nav';
import { AssessmentService } from '../assessment/assessment.service';
import { CaptrLearnersService } from '../captr-learners/captr-learners.services';
import { CompleteAssessmentsService } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments.service';
import { RiskAssessmentService } from '../captr-learners/view-captr-learner/risk-assessment/risk-assessment.service';
import { ViewLernerStapes } from '../learners/view-learner/view-lerner-stapes';
import { LocalJobsService } from '../job-adverts/local-jobs/local-jobs.service';
import { DocumentsService } from '../captr-learners/view-captr-learner/documents/documents.service';
import { PersonProfessionalViewComponent } from './person-professional-view/person-professional-view.component';
import { AutosizeModule } from 'ngx-autosize';
import { AddPreviousQualificationPopComponent } from './add-participant/add-previous-qualification-pop/add-previous-qualification-pop.component';
import { ToWardsQualificanPopUpComponent } from './add-participant/to-wards-qualification-pop-up/to-wards-qualifican-pop-up.component';
import { CertificatesComponent } from './view-participant/certificates/certificates.component';
import { AddCertificateComponent } from './view-participant/certificates/add-certificate/add-certificate.component';
import { CertificatesService } from './view-participant/certificates/certificates.service';
import { UploadCertificatesListComponent } from './view-participant/certificates/upload-certificates-list/upload-certificates-list.component';
import { AddPlanComponent } from './plan-v2/add-plan/add-plan.component';
import { EditPlanComponent } from './plan-v2/edit-plan/edit-plan.component';
import { SurveyModule } from 'survey-angular-ui';
import { PlanV2Component } from './plan-v2/plan-v2.component';
import { AddReviewComponent } from './plan-v2/add-review/add-review.component';
import { ViewPlanComponent } from './plan-v2/view-plan/view-plan.component';
import { AddGoalsAndActionsComponent } from './plan-v2/add-goals-and-actions/add-goals-and-actions.component';
import { AddActionComponent } from './plan-v2/add-action/add-action.component';
import { PersonSupportedGoalsComponent } from './plan-goals-actions/person-supported-goals/person-supported-goals.component';
import { StaffGoalsComponent } from './plan-goals-actions/staff-goals/staff-goals.component';
import { FeedbackReviewComponent } from './plan-v2/feedback-review/feedback-review.component';
@NgModule({
  declarations: [
    ParticipantV2Component,
    AddParticipantComponent,
    ViewParticipantComponent,
    PersonProfessionalViewComponent,
    AddPreviousQualificationPopComponent,
    ToWardsQualificanPopUpComponent,
    CertificatesComponent,
    AddCertificateComponent,
    UploadCertificatesListComponent,
    AddPlanComponent,
    EditPlanComponent,
    PlanV2Component,
    AddReviewComponent,
    ViewPlanComponent,
    AddGoalsAndActionsComponent,
    AddActionComponent,
    PersonSupportedGoalsComponent,
    StaffGoalsComponent,
    FeedbackReviewComponent
  ],
  imports: [
    CommonModule,
    ParticipantV2RoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    AppConfirmModule,
    FeatureAllowModule,
    MatTabsModule,
    MatButtonToggleModule,
    SharedModule,
    MatRadioModule,
    FileUploadModule,
    AddCaptrLearnerModule,
    ConfirmBoxModule,
    FormControlModule,
    MatSelectSearchModule,
    FormsModule,
    FilterPipeModule,
    AutosizeModule,
    SurveyModule
  ],
  providers :[
    EditParticipantSteps,
    EditLeanerSteps,
    DatePipe,
    EditCaptrLeanerSteps,
    SessionsService,
    LearnerNavigation,
    TrackTabService,
    ParticipantNavigation,
    ViewLernerStapes,
    DocumentsService,
    CompleteAssessmentsService,
    AssessmentService,
    CaptrLearnersService,
    RiskAssessmentService,
    CertificatesService,
    PlanV2Component,
    AddPlanComponent,
    EditPlanComponent,
  ],
  entryComponents: [
    SelectAnActivityModalComponent,
    AddInterventionModalComponent,
    AddOrEditAppointmentModalComponent,
    AddCommentModalComponent,
    EditInterventionModalComponent,
  ]
})
export class ParticipantV2Module { }
