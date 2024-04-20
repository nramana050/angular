import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from 'src/app/framework/guards/authentication.guard';
import { AuthorizationGuard } from 'src/app/framework/guards/authorization.guard';
import { CanDeactivateGuard } from 'src/app/framework/guards/can-deactivate/can-deactivate.guard';
import { LearnerOutcomeComponent } from '../learners/add-learner/learner-outcome/learner-outcome.component';
import { AddOutcomeComponent } from '../learners/add-learner/learner-outcome/outcome-list/add-outcome/add-outcome.component';
import { OutcomeListComponent } from '../learners/add-learner/learner-outcome/outcome-list/outcome-list.component';
import { AddCaptrLearnerComponent } from './add-captr-learner/add-captr-learner.component';
import { CaptrLearnersComponent } from './captr-learners.component';
import { EditEnrolmentComponent } from './enrolment-details/edit-enrolment/edit-enrolment.component';
import { EnrolmentDetailsComponent } from './enrolment-details/enrolment-details.component';
import { AddOrEditCaseNotesComponent } from './view-captr-learner/case-note/add-or-edit-case-notes/add-or-edit-case-notes.component';
import { CaseNoteComponent } from './view-captr-learner/case-note/case-note.component';
import { CaseNotesComponent } from './view-captr-learner/case-note/case-notes/case-notes.component';
import { ViewCaseNoteComponent } from './view-captr-learner/case-note/view-case-note/view-case-note.component';
import { CompleteAssessmentComponent } from './view-captr-learner/complete-assessments/complete-assessment/complete-assessment.component';
import { CompleteAssessmentsTabsComponent } from './view-captr-learner/complete-assessments/complete-assessments-tabs/complete-assessments-tabs.component';
import { CompleteAssessmentsComponent } from './view-captr-learner/complete-assessments/complete-assessments.component';
import { ViewCompleteAssessmentComponent } from './view-captr-learner/complete-assessments/view-assessment/view-assessment.component';
import { DocumentsComponent } from './view-captr-learner/documents/documents.component';
import { UploadDocumentComponent } from './view-captr-learner/documents/upload-document/upload-document.component';
import { FavouritesJobsComponent } from './view-captr-learner/job-activity/favourites-jobs/favourites-jobs.component';
import { JobActivityComponent } from './view-captr-learner/job-activity/job-activity.component';
import { JobApplicationsComponent } from './view-captr-learner/job-activity/job-applications/job-applications.component';
import { LocalJobsComponent } from './view-captr-learner/job-activity/local-jobs/local-jobs.component';
import { ViewFavouritesJobsComponent } from './view-captr-learner/job-activity/view-favourites-job/view-favourites-jobs/view-favourites-jobs.component';
import { PlanContentCardComponent } from './view-captr-learner/plan-content-card/plan-content-card.component';
import { CheckAnswerComponent } from './view-captr-learner/plan-induction/check-answer/check-answer.component';
import { PlanInductionComponent } from './view-captr-learner/plan-induction/plan-induction.component';
import { ViewFurtherInformationComponent } from './view-captr-learner/view-further-information/view-further-information.component';
import { ViewCaptrLearnerComponent } from './view-captr-learner/view-learner-profile/view-captr-learner.component';
import { ViewUserCvComponent } from './view-captr-learner/view-user-cv/view-user-cv.component';
import { ParticipantProfessionalViewComponent } from './participant-professional-view/participant-professional-view.component';
import { ProfessionalDocumentsComponent } from './view-captr-learner/professional-documents/professional-documents.component';
import { UploadProfessionalDocumentComponent } from './view-captr-learner/professional-documents/upload-professional-document/upload-professional-document.component';
import { EditRiskAssessmentComponent } from './view-captr-learner/risk-assessment/edit-risk-assessment/edit-risk-assessment.component';
import { RiskAssessmentComponent } from './view-captr-learner/risk-assessment/risk-assessment.component';
import { ReferralComponent } from './view-captr-learner/referral/referral.component';
import { AddReferralComponent } from './view-captr-learner/referral/add-referral/add-referral.component';
import { ViewReferralComponent } from './view-captr-learner/referral/view-referral/view-referral.component';
import { UsefulContactsComponent } from './view-captr-learner/useful-contacts/useful-contacts.component';
import { ViewUsefulContactsComponent } from './view-captr-learner/useful-contacts/view-useful-contacts/view-useful-contacts.component';
import { AddEditUsefulContactsComponent } from './view-captr-learner/useful-contacts/add-edit-useful-contacts/add-edit-useful-contacts.component';
import { PrintCaseNotesComponent } from './view-captr-learner/case-note/print-case-notes/print-case-notes.component';
import { DigitalCourseProgressComponent } from './view-captr-learner/participant-learning/digital-course-progress/digital-course-progress.component';
import { PerformanceReviewComponent } from './view-captr-learner/performance-review/performance-review.component';
import { ViewPerformanceReviewAssessmentComponent } from './view-captr-learner/performance-review/view-performance-review-assessment/view-performance-review-assessment.component';
import { EditPerformanceReviewAssessmentComponent } from './view-captr-learner/performance-review/edit-performance-review-assessment/edit-performance-review-assessment.component';
import { ViewEnrolmentDetailsComponent } from '../learners/enrolment-details/view-enrolment-details/view-enrolment-details.component';
import { CourseLaunchComponent } from './view-captr-learner/participant-learning/digital-course-progress/course-launch/course-launch.component';
import { CalendarComponent } from './view-captr-learner/calendar/calendar.component';
import { ProgrammeEnrolmentComponent } from './view-captr-learner/participant-learning/programme-enrolment/programme-enrolment.component';
import { ProgrammeOutcomesComponent } from './view-captr-learner/participant-learning/programme-outcomes/programme-outcomes.component';
import { ViewProgrammeEnrolmentComponent } from './view-captr-learner/participant-learning/programme-enrolment/view-programme-enrolment/view-programme-enrolment.component';
import { ProgrammeOutcomesListComponent } from './view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/programme-outcomes-list.component';
import { ViewProgrammeOutcomeComponent } from './view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/view-programme-outcome/view-programme-outcome.component';
import { SystemInteractionsComponent } from './view-captr-learner/system-interactions/system-interactions.component';
import { TimelineSystemInteractionComponent } from './view-captr-learner/system-interactions/timeline-system-interaction/timeline-system-interaction.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { SystemInteractionV2Component } from '../participant-v2/view-participant/system-interaction-v2/system-interaction-v2.component';
const caseNote = 'case-note';
const routes: Routes = [
  {
    path: '',
    component: CaptrLearnersComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '' , auth:[9]},
  },
  {
    path: 'new-learner',
    component: AddCaptrLearnerComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Add Participant' , auth:[9,1], identifier:PageTitleIdentifier.Add_Participant},
  },
  {
    path: 'edit-learner',
    component: AddCaptrLearnerComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Edit Participant' , auth:[9,3], identifier:PageTitleIdentifier.Edit_Participant}
  },
  {
    path: 'profile',
    component: ViewCaptrLearnerComponent,
    data: { title: 'View Participant',  identifier:PageTitleIdentifier.profile }
  },
  {
    path: 'participant-professional-view',
    component: ParticipantProfessionalViewComponent,
    data: { title: 'Participants' }
  },
  {
    path: 'enrolment-details',
    component: EnrolmentDetailsComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Enrolment' , auth:[50], identifier:PageTitleIdentifier.Enrolment},
  },
  {
    path: 'enrolment-details/edit-enrolment',
    canActivate: [AuthorizationGuard],
    component: EditEnrolmentComponent,
    data: { title: 'Edit Enrolment' , auth:[50,1], identifier:PageTitleIdentifier.Edit_Enrolment},
  },
  {
    path: 'enrolment-details/view-enrolment-details',
    canActivate: [AuthorizationGuard],
    component: ViewEnrolmentDetailsComponent,
    data: { title: 'Edit Enrolment' , auth:[50,1], identifier:PageTitleIdentifier.Edit_Enrolment},
  },
  {
    path: 'learner-outcome',
    component: LearnerOutcomeComponent,
    data: { title: 'Employment Outcome', identifier:PageTitleIdentifier.Employment_Outcome }
  },
  {
    path: 'learner-outcome/outcome-list',
    component: OutcomeListComponent,
    data: { title: 'Outcome List', identifier:PageTitleIdentifier.Outcome_List},
  },
  {
    path: 'learner-outcome/outcome-list/add-outcome',
    component: AddOutcomeComponent,
    data: { title: 'Add Outcome', identifier:PageTitleIdentifier.Add_Outcome},
  },
  {
    path: 'learner-outcome/outcome-list/edit-outcome',
    component: AddOutcomeComponent,
    data: { title: 'Edit Outcome', identifier:PageTitleIdentifier.Edit_Outcome},
  },
  {
    path: "profile/action-plan",
    component: PlanInductionComponent,
    canDeactivate: [CanDeactivateGuard],
    data: { identifier:PageTitleIdentifier.profile }
  },
  {
    path: "profile/check-answer",
    component: CheckAnswerComponent,
    canDeactivate: [CanDeactivateGuard],
    data: { identifier:PageTitleIdentifier.profile }
  },
  {
    path: "profile/view-further-information",
    component: ViewFurtherInformationComponent,
    data: { identifier:PageTitleIdentifier.profile }
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    data: { title: 'View Learner',auth: [9], identifier:PageTitleIdentifier.Documents },
  },
  {
    path: 'documents/upload',
    component: UploadDocumentComponent,
    data: { title: 'Upload Documents', auth: [9], identifier:PageTitleIdentifier.Documents  },
    canActivateChild: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: "cv",
    component: ViewUserCvComponent,
    data: { title: 'Upload Documents', auth: [9],  identifier:PageTitleIdentifier.Cvs},
  },
  {
    path: 'plan',
    component: PlanContentCardComponent,
    data: {  identifier:PageTitleIdentifier.My_To_Do}
  },
  {
    path: "assessments/edit",
    component: CompleteAssessmentComponent,
  },
  {
    path: 'assessments',
    component: CompleteAssessmentsTabsComponent,
    children: [
      {
        path: '',
        redirectTo: 'todo',
        pathMatch: 'full'
      },
      {
        path: ":status",
        component: CompleteAssessmentsComponent,
      },
      {
        path: ":status/edit",
        component: CompleteAssessmentComponent,
      },
      {
        path: ":status/view",
        component: ViewCompleteAssessmentComponent,
      },
    ]
  },
  {
    path: 'job-activity',
    component: JobActivityComponent,
    data: { auth: [29], identifier:PageTitleIdentifier.Job_Opportunities },
    children: [
      {
        path: '',
        redirectTo: 'local-jobs',
        pathMatch: 'full',
      },
      {
        path: 'favourites',
        component: FavouritesJobsComponent,
      },
      {
        path: "favourites/view",
        component: ViewFavouritesJobsComponent,
      },
      {
        path: "job-applications",
        component: JobApplicationsComponent,
      },
      {
        path: "local-jobs",
        component: LocalJobsComponent,
        data: { auth: [19],},
        canActivateChild: [AuthenticationGuard, AuthorizationGuard],
      },]
  },
  {
    path: 'case-note',
    component: CaseNoteComponent,
    data: {identifier:PageTitleIdentifier.Case_Notes },
    children: [
      {
        path: '',
        redirectTo: caseNote,
        pathMatch: 'full',
      },
      {
        path: caseNote,
        component: CaseNotesComponent,
        data: { auth: [19] },
        canActivateChild: [AuthenticationGuard, AuthorizationGuard],
      },
      {
        path: 'case-note/view-case-note',
        component: ViewCaseNoteComponent,
      },
      {
        path: 'case-note/add-case-note',
        component: AddOrEditCaseNotesComponent,
      },
      {
        path: 'case-note/print-case-notes',
        component: PrintCaseNotesComponent,
      },
    ]
  },
  {
    path: "professional-document",
    component: ProfessionalDocumentsComponent,
    data: { identifier:PageTitleIdentifier.professional_document},
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'professional-document/upload-doc',
    component: UploadProfessionalDocumentComponent,
    data: { title: 'Upload Documents', auth: [9], identifier:PageTitleIdentifier.professional_document},
    canActivateChild: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: "risk-assessment",
    component: RiskAssessmentComponent,
    data: { identifier:PageTitleIdentifier.Risk_Assessment},
  },
  {
    path: "risk-assessment/edit-risk-assessment",
    component: EditRiskAssessmentComponent,
    data: { identifier:PageTitleIdentifier.Risk_Assessment},
    canDeactivate: [CanDeactivateGuard],
    
  },
  {
    path: 'useful-contacts',
    component: UsefulContactsComponent,
  },
  {
    path: 'useful-contacts/view/:id',
    component: ViewUsefulContactsComponent,
  },
  {
    path: 'useful-contacts/contacts',
    component: AddEditUsefulContactsComponent,
  },
  {
    path: 'useful-contacts/contacts/:contactId',
    component: AddEditUsefulContactsComponent,
  },
  {
    path: "referral",
    component: ReferralComponent,
    data: { identifier:PageTitleIdentifier.Referrals},
  },

  {
    path: 'referral/add-referral',
    component: AddReferralComponent,
    data: { identifier:PageTitleIdentifier.Referrals},
  },
  {
    path: 'referral/edit-referral',
    component: AddReferralComponent,
    data: { identifier:PageTitleIdentifier.Referrals},
  },

  {
    path: 'referral/view-referral',
    component: ViewReferralComponent,
    data: { identifier:PageTitleIdentifier.Referrals},
  },
 
  {
    path: 'digital-course-progress',
    component: DigitalCourseProgressComponent,
  },
  {
    path: 'useful-contacts/view/:id',
    component: ViewUsefulContactsComponent,
  },
  {
    path: 'useful-contacts/contacts',
    component: AddEditUsefulContactsComponent,
  },
  {
    path: 'useful-contacts/contacts/:contactId',
    component: AddEditUsefulContactsComponent,
  },
  {
    path: 'performance-review',
    component: PerformanceReviewComponent,
    data: { identifier: PageTitleIdentifier.performance_review },
  },
  {
    path: 'performance-review/view',
    component: ViewPerformanceReviewAssessmentComponent,
  },
  {
    path: 'performance-review/edit',
    component: EditPerformanceReviewAssessmentComponent,
  },

  {
    path: 'digital-course-progress',
    component: DigitalCourseProgressComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'digital-course-progress' , auth:[89], identifier:PageTitleIdentifier.digital_course_progress},
  },
  {
    path: 'digital-course-progress/courseLaunch/:courseId',
    component: CourseLaunchComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'digital-course-progress' , auth:[89]},
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },

  {
    path: 'programme-enrolment',
    component: ProgrammeEnrolmentComponent,
  },
  {
    path: 'programme-outcomes',
    component: ProgrammeOutcomesComponent,
  },
  {
    path: 'programme-enrolment/viewProgram',
    component: ViewProgrammeEnrolmentComponent
  },
  {
    path: 'programme-outcomes/programme-outcome-list',
    component: ProgrammeOutcomesListComponent
  },
  {
    path: 'programme-outcomes/programme-outcome-list/view-programme-outcome',
    component: ViewProgrammeOutcomeComponent
  },
  {
    path: 'system-interactions',
    component: SystemInteractionV2Component,
    data: { identifier:PageTitleIdentifier.system_interactions, auth:[118]},
  },
  {
    path: 'system-interactions/timeline-system-interaction',
    component: TimelineSystemInteractionComponent,
    data: { identifier:PageTitleIdentifier.system_interactions},
  },
  {
    path: 'digital-course-progress/courseLaunch/:courseId',
    component: CourseLaunchComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'digital-course-progress' , auth:[89], identifier:PageTitleIdentifier.digital_course_progress},
  }, 

  {
    path: 'digital-course-progress/programme-enrolment',
    component: ProgrammeEnrolmentComponent,
    data: { auth: [50],identifier:PageTitleIdentifier.Programme_enrolment },
  },
  {
    path: 'digital-course-progress/programme-outcomes',
    component: ProgrammeOutcomesComponent,
    data: { auth: [50],identifier:PageTitleIdentifier.programme_outcomes },
  },
  {
    path: 'digital-course-progress/programme-enrolment/viewProgram',
    component: ViewProgrammeEnrolmentComponent,
    data: { identifier:PageTitleIdentifier.Programme_enrolment },
  },
  {
    path: 'digital-course-progress/programme-outcomes/programme-outcome-list',
    component: ProgrammeOutcomesListComponent,
    data: {identifier:PageTitleIdentifier.programme_outcomes },
  },
  {
    path: 'digital-course-progress/programme-outcomes/programme-outcome-list/view-programme-outcome',
    component: ViewProgrammeOutcomeComponent,
    data: { title: 'View Outcome',identifier:PageTitleIdentifier.programme_outcomes},
  },
  {
    path: 'system-interactions',
    component: SystemInteractionsComponent,
  },
  {
    path: 'system-interactions/timeline-system-interaction',
    component: TimelineSystemInteractionComponent,
  },
 
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { auth: [103] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaptrLearnersRoutingModule { }
