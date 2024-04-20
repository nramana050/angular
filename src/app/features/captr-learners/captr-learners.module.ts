import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CaptrLearnersRoutingModule } from './captr-learners-routing.module';
import { AddCaptrLearnerComponent } from './add-captr-learner/add-captr-learner.component';
import { EnrolmentDetailsComponent } from './enrolment-details/enrolment-details.component';
import { EditEnrolmentComponent } from './enrolment-details/edit-enrolment/edit-enrolment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { AppConfirmModule } from 'src/app/framework/components/app-confirm/app-confirm.module';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { FeatureAllowModule } from '../shared/components/directives/features-allow.module';
import { EditCaptrLeanerSteps } from './add-captr-learner/edit-captr-learner.steps';
import { ViewCaptrLearnerComponent } from './view-captr-learner/view-learner-profile/view-captr-learner.component';
import { LearnerNavigation } from './view-captr-learner/learner-nav';
import { PlanInductionComponent } from './view-captr-learner/plan-induction/plan-induction.component';
import { DocumentsComponent } from './view-captr-learner/documents/documents.component';
import { FileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { DocumentsService } from './view-captr-learner/documents/documents.service';
import { UploadDocumentComponent } from './view-captr-learner/documents/upload-document/upload-document.component';
import { ViewUserCvComponent } from './view-captr-learner/view-user-cv/view-user-cv.component';
import { PlanContentCardComponent } from './view-captr-learner/plan-content-card/plan-content-card.component';
import { ScheduleTabComponent } from './view-captr-learner/plan-content-card/schedule-tab/schedule-tab.component';
import { CompleteAssessmentsService } from './view-captr-learner/complete-assessments/complete-assessments.service';
import { CompleteAssessmentsComponent } from './view-captr-learner/complete-assessments/complete-assessments.component';
import { CompleteAssessmentsTabsComponent } from './view-captr-learner/complete-assessments/complete-assessments-tabs/complete-assessments-tabs.component';
import { CompleteAssessmentComponent } from './view-captr-learner/complete-assessments/complete-assessment/complete-assessment.component';
import { ViewCompleteAssessmentComponent } from './view-captr-learner/complete-assessments/view-assessment/view-assessment.component';
import { ViewFavouritesJobsComponent } from './view-captr-learner/job-activity/view-favourites-job/view-favourites-jobs/view-favourites-jobs.component';
import { LocalJobsComponent } from './view-captr-learner/job-activity/local-jobs/local-jobs.component';
import { JobApplicationsComponent } from './view-captr-learner/job-activity/job-applications/job-applications.component';
import { JobActivityComponent } from './view-captr-learner/job-activity/job-activity.component';
import { FavouritesJobsComponent } from './view-captr-learner/job-activity/favourites-jobs/favourites-jobs.component';
import { AddCaptrLearnerModule } from './add-captr-learner/add-captr-learner.module';
import { ActionPlanHistoryComponent } from './view-captr-learner/plan-induction/action-plan-history/action-plan-history.component';
import { CheckAnswerComponent } from './view-captr-learner/plan-induction/check-answer/check-answer.component';
import { ParticipantStatusPopUpComponent } from './view-captr-learner/plan-induction/participant-status-pop-up/participant-status-pop-up.component';
import { ViewVirtualCampusInfoComponent } from './view-captr-learner/plan-induction/view-virtual-campus-info/view-virtual-campus-info.component';
import { ConfirmBoxModule } from '../shared/components/confirm-box/confirm-box.module';
import { NotificationComponent } from '../shared/components/notification/notification.component';
import { PriorityAreaComponent } from './view-captr-learner/priority-area/priority-area.component';
import { AddActionGoalModalComponent } from './view-captr-learner/priority-area/add-action-goal-modal/add-action-goal-modal.component';
import { FormControlModule } from '../shared/components/form-control/form-control.module';
import { ViewFurtherInformationComponent } from './view-captr-learner/view-further-information/view-further-information.component';
import { EditLeanerSteps } from '../learners/add-learner/edit-learner.steps';
import { ParticipantProfessionalViewComponent } from './participant-professional-view/participant-professional-view.component';
import { MatSelectSearchModule } from '../shared/components/mat-select-search/mat-select-search.module';
import { ViewCaseNoteComponent } from './view-captr-learner/case-note/view-case-note/view-case-note.component';
import { CaseNoteComponent } from './view-captr-learner/case-note/case-note.component';
import { AddOrEditCaseNotesComponent } from './view-captr-learner/case-note/add-or-edit-case-notes/add-or-edit-case-notes.component';
import { CaptrLearnersService } from './captr-learners.services';
import { CaseNotesComponent } from './view-captr-learner/case-note/case-notes/case-notes.component';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { ParticipantToDoComponent } from './view-captr-learner/plan-content-card/participant-to-do/participant-to-do.component';
import { MyGoalsTabComponent } from './view-captr-learner/plan-content-card/my-goals-tab/my-goals-tab.component';
import { TrackTabComponent } from './view-captr-learner/plan-content-card/track-tab/track-tab.component';
import { EntryInductionComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-entries/entry-induction/entry-induction.component';
import { TrackTabService } from './view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { SelectAnActivityModalComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-modals/select-an-activity-modal/select-an-activity-modal.component';
import { AddCommentModalComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-comment-modal/add-comment-modal.component';
import { EntryAppointmentComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-entries/entry-appointment/entry-appointment.component';
import { EntrySystemComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-entries/entry-system/entry-system.component';
import { AddOrEditAppointmentModalComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-or-edit-appointment-modal/add-or-edit-appointment-modal.component';
import { AddInterventionModalComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-intervention-modal/add-intervention-modal.component';
import { EntryInterventionComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-entries/entry-intervention/entry-intervention.component';
import { EntryCommentComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-entries/entry-comment/entry-comment.component';
import { EditInterventionModalComponent } from './view-captr-learner/plan-content-card/track-tab/f-structure-modals/edit-intervention-modal/edit-intervention-modal.component';
import { AssessmentService } from '../assessment/assessment.service';
import { ViewAssessmentPopUpComponent } from './view-captr-learner/plan-induction/view-assessment-pop-up/view-assessment-pop-up.component';
import { SessionsService } from '../shared/services/sessions.service';
import { ProfessionalDocumentsComponent } from './view-captr-learner/professional-documents/professional-documents.component';
import { UploadProfessionalDocumentComponent } from './view-captr-learner/professional-documents/upload-professional-document/upload-professional-document.component';
import { EditRiskAssessmentComponent } from './view-captr-learner/risk-assessment/edit-risk-assessment/edit-risk-assessment.component';
import { RiskAssessmentHistoryComponent } from './view-captr-learner/risk-assessment/risk-assessment-history/risk-assessment-history.component';
import { RiskAssessmentComponent } from './view-captr-learner/risk-assessment/risk-assessment.component';
import { RiskAssessmentService } from './view-captr-learner/risk-assessment/risk-assessment.service';
import { ReferralComponent } from './view-captr-learner/referral/referral.component';
import { AddReferralComponent } from './view-captr-learner/referral/add-referral/add-referral.component';
import { ViewReferralComponent } from './view-captr-learner/referral/view-referral/view-referral.component';
import { UsefulContactsComponent } from './view-captr-learner/useful-contacts/useful-contacts.component';
import { ViewUsefulContactsComponent } from './view-captr-learner/useful-contacts/view-useful-contacts/view-useful-contacts.component';
import { AddEditUsefulContactsComponent } from './view-captr-learner/useful-contacts/add-edit-useful-contacts/add-edit-useful-contacts.component';
import { PrintCaseNotesComponent } from './view-captr-learner/case-note/print-case-notes/print-case-notes.component';
import { PerformanceReviewComponent } from './view-captr-learner/performance-review/performance-review.component';
import { ViewPerformanceReviewAssessmentComponent } from './view-captr-learner/performance-review/view-performance-review-assessment/view-performance-review-assessment.component';
import { EditPerformanceReviewAssessmentComponent } from './view-captr-learner/performance-review/edit-performance-review-assessment/edit-performance-review-assessment.component';
import { SurveyModule } from 'survey-angular-ui';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ViewLernerStapes } from '../learners/view-learner/view-lerner-stapes';
import { DigitalCourseProgressComponent } from './view-captr-learner/participant-learning/digital-course-progress/digital-course-progress.component';
import { CourseLaunchComponent } from './view-captr-learner/participant-learning/digital-course-progress/course-launch/course-launch.component';
import { PrintReferralsComponent } from './view-captr-learner/referral/print-referrals/print-referrals.component';
import { ParticipantNavigation } from '../participant-v2/view-participant/participant-nav';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarComponent } from './view-captr-learner/calendar/calendar.component';
import { JobReadinessComponent } from './view-captr-learner/job-readiness/job-readiness.component';
import { AddJobReadinessComponent } from './view-captr-learner/job-readiness/add-job-readiness/add-job-readiness.component';
import { EditMentivityLeanerSteps } from '../mentivity-learners/add-mentivity-learners/edit-mentivity-learner.steps';
import { CaseNoteListV2Component } from '../participant-v2/view-participant/case-note-v2/case-note-list-v2/case-note-list-v2.component';
import { CaseNoteV2Component } from '../participant-v2/view-participant/case-note-v2/case-note-v2.component';
import { ProgrammeEnrolmentComponent } from './view-captr-learner/participant-learning/programme-enrolment/programme-enrolment.component';
import { ProgrammeOutcomesComponent } from './view-captr-learner/participant-learning/programme-outcomes/programme-outcomes.component';
import { ProgrammeOutcomesListComponent } from './view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/programme-outcomes-list.component';
import { ViewProgrammeOutcomeComponent } from './view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/view-programme-outcome/view-programme-outcome.component';
import { ViewProgrammeEnrolmentComponent } from './view-captr-learner/participant-learning/programme-enrolment/view-programme-enrolment/view-programme-enrolment.component';
import { SystemInteractionsComponent } from './view-captr-learner/system-interactions/system-interactions.component';
import { TimelineSystemInteractionComponent } from './view-captr-learner/system-interactions/timeline-system-interaction/timeline-system-interaction.component';
import { MentivityLearnerNavigation } from '../mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { PerformanceReviewService } from './view-captr-learner/performance-review/performance-review.service';
import { AddEditCaseNoteV2Component } from '../participant-v2/view-participant/case-note-v2/add-edit-case-note-v2/add-edit-case-note-v2.component';
import { ViewCaseNoteV2Component } from '../participant-v2/view-participant/case-note-v2/view-case-note-v2/view-case-note-v2.component';
import { JobReadinessHistoryComponent } from './view-captr-learner/job-readiness/job-readiness-history/job-readiness-history.component';
import { ReferralV2Component } from '../participant-v2/view-participant/referral-v2/referral-v2.component';
import { AddEditReferralV2Component } from '../participant-v2/view-participant/referral-v2/add-edit-referral-v2/add-edit-referral-v2.component';
import { ViewReferralV2Component } from '../participant-v2/view-participant/referral-v2/view-referral-v2/view-referral-v2.component';
import { PrintCaseNotesV2Component } from '../participant-v2/view-participant/case-note-v2/print-case-notes-v2/print-case-notes-v2.component';
import { StaffCommentsComponent } from './view-captr-learner/staff-comments/staff-comments.component';
import { SystemInteractionV2Component } from '../participant-v2/view-participant/system-interaction-v2/system-interaction-v2.component';
import { TimelineSystemInteractionV2Component } from '../participant-v2/view-participant/system-interaction-v2/timeline-system-interaction-v2/timeline-system-interaction-v2.component';

@NgModule({
  declarations: [
    AddCaptrLearnerComponent,
    ViewCaptrLearnerComponent,
    EnrolmentDetailsComponent,
    EditEnrolmentComponent,
    PlanInductionComponent,
    DocumentsComponent,
    UploadDocumentComponent,
    ViewUserCvComponent,
    PlanContentCardComponent,
    ScheduleTabComponent,
    TrackTabComponent,
    SelectAnActivityModalComponent,
    AddOrEditAppointmentModalComponent,
    AddInterventionModalComponent,
    AddCommentModalComponent,
    EntryInductionComponent,
    EntryInterventionComponent,
    EntryAppointmentComponent,
    EntryCommentComponent,
    EntrySystemComponent,
    EditInterventionModalComponent,
    CompleteAssessmentsComponent,
    CompleteAssessmentsTabsComponent,
    CompleteAssessmentComponent,
    ViewCompleteAssessmentComponent,
    ViewFavouritesJobsComponent,
    LocalJobsComponent,
    JobApplicationsComponent,
    JobActivityComponent,
    FavouritesJobsComponent,
    ActionPlanHistoryComponent,
    CheckAnswerComponent,
    ParticipantStatusPopUpComponent,
    ViewVirtualCampusInfoComponent,
    NotificationComponent,
    PriorityAreaComponent,
    AddActionGoalModalComponent,
    ViewFurtherInformationComponent,
    ParticipantProfessionalViewComponent,
    ParticipantToDoComponent,
    MyGoalsTabComponent,
    ProfessionalDocumentsComponent,
    RiskAssessmentComponent,
    EditRiskAssessmentComponent,
    UploadProfessionalDocumentComponent,
    RiskAssessmentHistoryComponent,
    ViewCaseNoteComponent,
    CaseNoteComponent,
    AddOrEditCaseNotesComponent,
    CaseNotesComponent,
    ViewAssessmentPopUpComponent,
    PrintCaseNotesComponent,
    ReferralComponent,
    AddReferralComponent,
    ViewReferralComponent,
    UsefulContactsComponent,
    ViewUsefulContactsComponent,
    AddEditUsefulContactsComponent,
    DigitalCourseProgressComponent,
    PerformanceReviewComponent,
    ViewPerformanceReviewAssessmentComponent,
    EditPerformanceReviewAssessmentComponent,
    CourseLaunchComponent,
    DigitalCourseProgressComponent,
    PrintReferralsComponent,
    CalendarComponent,
    ProgrammeEnrolmentComponent,
    ProgrammeOutcomesComponent,
    ViewProgrammeEnrolmentComponent,
    ProgrammeOutcomesListComponent,
    ViewProgrammeOutcomeComponent,
    SystemInteractionsComponent,
    TimelineSystemInteractionComponent,
    CourseLaunchComponent,
    JobReadinessComponent,
    AddJobReadinessComponent,
    AddEditCaseNoteV2Component,
    ViewCaseNoteV2Component,
    CaseNoteV2Component,
    CaseNoteListV2Component,
    JobReadinessHistoryComponent,
    ReferralV2Component,
    AddEditReferralV2Component,
    ViewReferralV2Component,
    PrintCaseNotesV2Component,
    StaffCommentsComponent,
    SystemInteractionV2Component,
    TimelineSystemInteractionV2Component,
    PrintReferralsComponent,
  ],
  imports: [
    CommonModule,
    CaptrLearnersRoutingModule,
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
    SurveyModule,
    NgApexchartsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbModule,

    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbModule,
    SurveyModule,
    NgApexchartsModule,
    FilterPipeModule
  ],
  providers :[
    EditCaptrLeanerSteps,
    EditLeanerSteps,
    ViewLernerStapes,
    DatePipe,
    LearnerNavigation,
    DocumentsService,
    TrackTabService,
    CompleteAssessmentsService,
    CaptrLearnersService,
    AssessmentService,
    SessionsService,
    CaptrLearnersService,
    RiskAssessmentService, 
    MentivityLearnerNavigation,
    EditMentivityLeanerSteps,
    PerformanceReviewService,
  ],
  entryComponents: [
    SelectAnActivityModalComponent,
    AddInterventionModalComponent,
    AddOrEditAppointmentModalComponent,
    AddCommentModalComponent,
    EditInterventionModalComponent,
  ],
  exports: [
    PriorityAreaComponent,
    MyGoalsTabComponent
  ]
})
export class CaptrLearnersModule { }
