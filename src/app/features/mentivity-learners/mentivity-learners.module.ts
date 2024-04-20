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
import { AddMentivityLearnersComponent } from './add-mentivity-learners/add-mentivity-learners.component';
import { MentivityLearnersRoutingModule } from './mentivity-learners-routing.module';
import { MentivityLearnersComponent } from './mentivity-learners.component';
import { EditMentivityLeanerSteps } from './add-mentivity-learners/edit-mentivity-learner.steps';
import { SessionsService } from '../shared/services/sessions.service';
import { CaptrLearnersService } from '../captr-learners/captr-learners.services';
import { EditCaptrLeanerSteps } from '../captr-learners/add-captr-learner/edit-captr-learner.steps';
import { EditLeanerSteps } from '../learners/add-learner/edit-learner.steps';
import { ViewLernerStapes } from '../learners/view-learner/view-lerner-stapes';
import { LearnerNavigation } from '../captr-learners/view-captr-learner/learner-nav';
import { DocumentsService } from '../captr-learners/view-captr-learner/documents/documents.service';
import { TrackTabService } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { CompleteAssessmentsService } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments.service';
import { AssessmentService } from '../assessment/assessment.service';
import { RiskAssessmentService } from '../captr-learners/view-captr-learner/risk-assessment/risk-assessment.service';
import { ParticipantProfessionalViewComponent } from './participant-professional-view/participant-professional-view.component';
import { MentivityLearnerNavigation } from './view-mentivity-learners/mentivity-learner-nav';
import { SelectAnActivityModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/select-an-activity-modal/select-an-activity-modal.component';
import { AddInterventionModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-intervention-modal/add-intervention-modal.component';
import { AddCommentModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-comment-modal/add-comment-modal.component';
import { EditInterventionModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/edit-intervention-modal/edit-intervention-modal.component';
import { AddOrEditAppointmentModalComponent } from '../captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-or-edit-appointment-modal/add-or-edit-appointment-modal.component';
import { ViewUserCvComponent } from '../captr-learners/view-captr-learner/view-user-cv/view-user-cv.component';
import { CaptrLearnersModule } from '../captr-learners/captr-learners.module';
import { PerformanceReviewService } from '../captr-learners/view-captr-learner/performance-review/performance-review.service';
import { ReferralService } from '../captr-learners/view-captr-learner/referral/referral.service';
import { PlanInductionService } from '../captr-learners/view-captr-learner/plan-induction/plan-induction.service';
import { DigitalCourseProgressService } from '../captr-learners/view-captr-learner/participant-learning/digital-course-progress/digital-course-progress.service';
import { ProgrammeOutcomesService } from '../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes.service';
import { ViewProfileComponent } from './view-mentivity-learners/view-profile/view-profile.component';
import { AddOutcomeComponent } from '../learners/add-learner/learner-outcome/outcome-list/add-outcome/add-outcome.component';
import { LearnersModule } from '../learners/learners.module';
import { CaseNoteComponent } from './view-mentivity-learners/case-note/case-note.component';
import { AddEditCaseNoteComponent } from './view-mentivity-learners/case-note/add-edit-case-note/add-edit-case-note.component';
import { CaseNotesComponent } from './view-mentivity-learners/case-note/case-notes/case-notes.component';
import { ViewCaseNoteComponent } from './view-mentivity-learners/case-note/view-case-note/view-case-note.component';
import { ReferralComponent } from './view-mentivity-learners/referral/referral.component';
import { AddReferralComponent } from './view-mentivity-learners/referral/add-referral/add-referral.component';
import { ViewReferralComponent } from './view-mentivity-learners/referral/view-referral/view-referral.component';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { ViewFurtherInfoComponent } from './view-mentivity-learners/view-further-info/view-further-info.component';
import { ActionPlanInductionComponent } from './view-mentivity-learners/action-plan-induction/action-plan-induction.component';
import { MentivityFurtherInfoComponent } from './mentivity-further-info/mentivity-further-info.component';
import { PrintCaseNotesComponent } from './view-mentivity-learners/case-note/print-case-notes/print-case-notes.component';


@NgModule({

  declarations: [
    MentivityLearnersComponent,
    AddMentivityLearnersComponent,
    ViewProfileComponent,
    ParticipantProfessionalViewComponent,
    MentivityFurtherInfoComponent,
    CaseNoteComponent,
    AddEditCaseNoteComponent,
    CaseNotesComponent,
    ViewCaseNoteComponent,
    ReferralComponent,
    AddReferralComponent,
    ViewReferralComponent,
    ViewFurtherInfoComponent,
    ActionPlanInductionComponent,  
    MentivityFurtherInfoComponent, 
    PrintCaseNotesComponent
    
  ],
  imports: [
    CommonModule,
      MentivityLearnersRoutingModule,
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
      CaptrLearnersModule,
      LearnersModule,
      FilterPipeModule
  ],
  providers: [
    EditMentivityLeanerSteps,
    SessionsService,
    MentivityLearnerNavigation, 
    ViewLernerStapes,  
    DatePipe,
    SessionsService,  
    TrackTabService,
    ViewLernerStapes,
    CompleteAssessmentsService,
    AssessmentService,
    CaptrLearnersService,
    RiskAssessmentService,
    DocumentsService,
    PerformanceReviewService,
    ReferralService,
    PlanInductionService,
    DigitalCourseProgressService,
    ProgrammeOutcomesService
  ],
  entryComponents: [
    SelectAnActivityModalComponent,
    AddInterventionModalComponent,
    AddOrEditAppointmentModalComponent,
    AddCommentModalComponent
  ]



})
export class MentivityLearnersModule { }
