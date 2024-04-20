import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppConfirmModule } from 'src/app/framework/components/app-confirm/app-confirm.module';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatureAllowModule } from '../shared/components/directives/features-allow.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { ConfirmBoxModule } from '../shared/components/confirm-box/confirm-box.module';
import { FormControlModule } from '../shared/components/form-control/form-control.module';
import { MatSelectSearchModule } from '../shared/components/mat-select-search/mat-select-search.module';
import { SelectAnActivityModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/select-an-activity-modal/select-an-activity-modal.component';
import { AddInterventionModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-intervention-modal/add-intervention-modal.component';
import { AddCommentModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-comment-modal/add-comment-modal.component';
import { EditInterventionModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/edit-intervention-modal/edit-intervention-modal.component';
import { AddOrEditAppointmentModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-or-edit-appointment-modal/add-or-edit-appointment-modal.component';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { LearnersModule } from '../learners/learners.module';
import { CaptrLearnersModule } from '../captr-learners/captr-learners.module';
import { AddEditParticipantV4Component } from './add-edit-participant-v4/add-edit-participant-v4.component';
import { ParticipantV4RoutingModule } from './participant-v4-routing.module';
import { AddCaptrLearnerModule } from '../captr-learners/add-captr-learner/add-captr-learner.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SurveyModule } from 'survey-angular-ui';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EditParticipantV4Steps } from './add-edit-participant-v4/edit-participant-v4.steps';
import { SessionsService } from '../shared/services/sessions.service';
import { DocumentsService } from '../captr-learners/view-captr-learner/documents/documents.service';
import { TrackTabService } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { LearnerNavigation } from '../captr-learners/view-captr-learner/learner-nav';
import { ViewFurtherInfoComponent } from './view-participant-v4/view-further-info/view-further-info.component';
import { CompleteAssessmentsService } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments.service';
import { ClinkReferralComponent } from './view-participant-v4/clink-referral/clink-referral.component';
import { AddReferralComponent } from './view-participant-v4/clink-referral/add-referral/add-referral.component';
import { ViewReferralComponent } from './view-participant-v4/clink-referral/view-referral/view-referral.component';
import { ClinkFurtherInformationComponent } from './further-information/clink-further-information.component';
import { ActionPlanInductionComponent } from './view-participant-v4/action-plan-induction/action-plan-induction.component';
import { QualificationPopUpComponent } from './add-edit-participant-v4/qualification-pop-up/qualification-pop-up.component';
import { ParticipantV4Component } from './participant-v4.component';
import { ParticipantProfessionalViewComponent } from './participant-professional-view/participant-professional-view.component';
import { ViewProfileComponent } from './view-participant-v4/view-profile/view-profile.component';
import { RiskAssessmentComponent } from './view-participant-v4/risk-assessment/risk-assessment.component';
import { RiskAssessmentService } from './view-participant-v4/risk-assessment/risk-assessment.service';
import { EditRiskAssessmentComponent } from './view-participant-v4/edit-risk-assessment/edit-risk-assessment.component';
import { RiskAssessmentHistoryComponent } from './view-participant-v4/risk-assessment-history/risk-assessment-history.component';
import { RiskAssessmentDocumentComponent } from './view-participant-v4/risk-assessment-document/risk-assessment-document.component';
import { PrintReferralsComponent } from './view-participant-v4/clink-referral/print-referrals/print-referrals.component';


@NgModule({

  declarations: [
    ParticipantV4Component,
    AddEditParticipantV4Component,
    ParticipantProfessionalViewComponent,
    ViewProfileComponent,
    QualificationPopUpComponent, 
    ClinkFurtherInformationComponent,
    ViewFurtherInfoComponent,
    ActionPlanInductionComponent,
    ClinkReferralComponent,
    AddReferralComponent,
    ViewReferralComponent,    
    RiskAssessmentComponent,
    EditRiskAssessmentComponent,
    RiskAssessmentHistoryComponent,
    RiskAssessmentDocumentComponent,
    PrintReferralsComponent,    
  ],
    imports: [
      CommonModule,
      ParticipantV4RoutingModule,
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
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbModule,
    SurveyModule,
    NgApexchartsModule,
    FilterPipeModule,
    CaptrLearnersModule,
    LearnersModule,    
    ],
    providers:[
      EditParticipantV4Steps,
      // LearnerNavigation,
      CommonModule,
      ParticipantV4RoutingModule,
      MaterialModule,
      ReactiveFormsModule,
      AppConfirmModule,
      FeatureAllowModule,
      MatTabsModule,
      MatButtonToggleModule,
      SharedModule,
      MatRadioModule,
      FileUploadModule,
      ConfirmBoxModule,
      FormControlModule,
      MatSelectSearchModule,
      FormsModule,
      CommonModule,  
      FilterPipeModule,
      SessionsService,
      CompleteAssessmentsService,
      DocumentsService,
      TrackTabService,
      RiskAssessmentService
  ],
  entryComponents: [
    SelectAnActivityModalComponent,
    AddInterventionModalComponent,
    AddOrEditAppointmentModalComponent,
    AddCommentModalComponent,
    EditInterventionModalComponent,
  ]



})
export class ParticipantV4Module { }
