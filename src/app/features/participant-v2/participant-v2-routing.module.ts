import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from 'src/app/framework/guards/authorization.guard';
import { AddParticipantComponent } from './add-participant/add-participant.component';
import { ParticipantV2Component } from './participant-v2.component';
import { ViewParticipantComponent } from './view-participant/view-participant.component';
import { AuthenticationGuard } from 'src/app/framework/guards/authentication.guard';
import { PlanContentCardComponent } from '../captr-learners/view-captr-learner/plan-content-card/plan-content-card.component';
import { ViewUserCvComponent } from '../captr-learners/view-captr-learner/view-user-cv/view-user-cv.component';
import { DocumentsComponent } from '../captr-learners/view-captr-learner/documents/documents.component';
import { UploadDocumentComponent } from '../captr-learners/view-captr-learner/documents/upload-document/upload-document.component';
import { FavouritesJobsComponent } from '../captr-learners/view-captr-learner/job-activity/favourites-jobs/favourites-jobs.component';
import { JobActivityComponent } from '../captr-learners/view-captr-learner/job-activity/job-activity.component';
import { JobApplicationsComponent } from '../captr-learners/view-captr-learner/job-activity/job-applications/job-applications.component';
import { ViewFavouritesJobsComponent } from '../captr-learners/view-captr-learner/job-activity/view-favourites-job/view-favourites-jobs/view-favourites-jobs.component';
import { LocalJobsComponent } from '../job-adverts/local-jobs/local-jobs.component';
import { DigitalCourseProgressComponent } from '../captr-learners/view-captr-learner/participant-learning/digital-course-progress/digital-course-progress.component';
import { PlanInductionComponent } from '../captr-learners/view-captr-learner/plan-induction/plan-induction.component';
import { CanDeactivateGuard } from 'src/app/framework/guards/can-deactivate/can-deactivate.guard';
import { CompleteAssessmentComponent } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessment/complete-assessment.component';
import { CompleteAssessmentsTabsComponent } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments-tabs/complete-assessments-tabs.component';
import { CompleteAssessmentsComponent } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments.component';
import { ViewCompleteAssessmentComponent } from '../captr-learners/view-captr-learner/complete-assessments/view-assessment/view-assessment.component';
import { AddEditUsefulContactsComponent } from '../captr-learners/view-captr-learner/useful-contacts/add-edit-useful-contacts/add-edit-useful-contacts.component';
import { UsefulContactsComponent } from '../captr-learners/view-captr-learner/useful-contacts/useful-contacts.component';
import { ViewUsefulContactsComponent } from '../captr-learners/view-captr-learner/useful-contacts/view-useful-contacts/view-useful-contacts.component';
import { PersonProfessionalViewComponent } from './person-professional-view/person-professional-view.component';
import { ProfessionalDocumentsComponent } from '../captr-learners/view-captr-learner/professional-documents/professional-documents.component';
import { UploadProfessionalDocumentComponent } from '../captr-learners/view-captr-learner/professional-documents/upload-professional-document/upload-professional-document.component';
import { EditRiskAssessmentComponent } from '../captr-learners/view-captr-learner/risk-assessment/edit-risk-assessment/edit-risk-assessment.component';
import { RiskAssessmentComponent } from '../captr-learners/view-captr-learner/risk-assessment/risk-assessment.component';
import { JobReadinessComponent } from '../captr-learners/view-captr-learner/job-readiness/job-readiness.component';
import { AddEditCaseNoteV2Component } from './view-participant/case-note-v2/add-edit-case-note-v2/add-edit-case-note-v2.component';
import { CaseNoteV2Component } from './view-participant/case-note-v2/case-note-v2.component';
import { CaseNoteListV2Component } from './view-participant/case-note-v2/case-note-list-v2/case-note-list-v2.component';
import { ViewCaseNoteV2Component } from './view-participant/case-note-v2/view-case-note-v2/view-case-note-v2.component';
import { DeactivateGuard } from 'src/app/framework/guards/deactivate.guard';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { CourseLaunchComponent } from '../captr-learners/view-captr-learner/participant-learning/digital-course-progress/course-launch/course-launch.component';
import { ProgrammeEnrolmentComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-enrolment/programme-enrolment.component';
import { ViewProgrammeEnrolmentComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-enrolment/view-programme-enrolment/view-programme-enrolment.component';
import { ProgrammeOutcomesListComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/programme-outcomes-list.component';
import { ViewProgrammeOutcomeComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/view-programme-outcome/view-programme-outcome.component';
import { ProgrammeOutcomesComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes.component';
import { ReferralV2Component } from './view-participant/referral-v2/referral-v2.component';
import { AddEditReferralV2Component } from './view-participant/referral-v2/add-edit-referral-v2/add-edit-referral-v2.component';
import { ViewReferralV2Component } from './view-participant/referral-v2/view-referral-v2/view-referral-v2.component';
import { StaffCommentsComponent } from '../captr-learners/view-captr-learner/staff-comments/staff-comments.component';
import { SystemInteractionV2Component } from './view-participant/system-interaction-v2/system-interaction-v2.component';
import { CertificatesComponent } from './view-participant/certificates/certificates.component';
import { AddCertificateComponent } from './view-participant/certificates/add-certificate/add-certificate.component';
import { UploadCertificatesListComponent } from './view-participant/certificates/upload-certificates-list/upload-certificates-list.component';
import { PlanV2Component } from './plan-v2/plan-v2.component';
import { EditPlanComponent } from './plan-v2/edit-plan/edit-plan.component';
import { ViewPlanComponent } from './plan-v2/view-plan/view-plan.component';
import { AddGoalsAndActionsComponent } from './plan-v2/add-goals-and-actions/add-goals-and-actions.component';
import { PersonSupportedGoalsComponent } from './plan-goals-actions/person-supported-goals/person-supported-goals.component';
import { StaffGoalsComponent } from './plan-goals-actions/staff-goals/staff-goals.component';
import { FeedbackReviewComponent } from './plan-v2/feedback-review/feedback-review.component';


const caseNote = 'case-note';
const routes: Routes = [
  {
    path: '',
    component: ParticipantV2Component,
    data: { title: '', auth:[97] },
  },
  {
    path: 'new-participant',
    component: AddParticipantComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Add Person Supported' , auth:[97,1]},
  },
  {
    path: 'edit-participant',
    component: AddParticipantComponent,
    canDeactivate: [DeactivateGuard],
    canActivate: [AuthorizationGuard],
    data: { title: 'Edit Person Supported', auth:[97, 3]}
  },
  {
    path: 'view-participant',
    component: ViewParticipantComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Person supported', auth:[97, 2]},
  },
  {
    path: 'participant-professional-view',
    component: PersonProfessionalViewComponent,
    data: { title: 'Person Supported' }
  },
  {
    path: '',
    component: CaseNoteV2Component,
    children: [
    
      {
        path: caseNote,
        component: CaseNoteListV2Component,
        data: { auth: [112] },
        canActivateChild: [AuthenticationGuard, AuthorizationGuard],
      },
      {
        path: 'case-note/view-case-note',
        component: ViewCaseNoteV2Component,
      },
      {
        path: 'case-note/add-case-note',
        component: AddEditCaseNoteV2Component,
      },
    ]
  },
  {
    path: 'profile',
    component: ViewParticipantComponent,
    data: { title: 'View Person Supported'}
  },
  {
    path: 'plan-v2',
    component: PlanV2Component,
    data: { identifier:PageTitleIdentifier.system_interactions, auth:[123]},
  },
  {
    path: 'plan-v2/add-goals',
    canActivate: [AuthorizationGuard],
    canDeactivate: [DeactivateGuard],
    component: AddGoalsAndActionsComponent,
    data: { identifier:PageTitleIdentifier.system_interactions, auth:[123]},
    
  },
  {
    path: "profile/action-plan",
    component: PlanInductionComponent,
    
  },
  {
    path: "cv",
    component: ViewUserCvComponent,
  },
  {
    path: 'plan',
    component: PersonSupportedGoalsComponent,
  },
  {
    path: 'plan/staff-goals',
    component: StaffGoalsComponent,
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    data: { title: 'View Learner',auth: [9] },
  },
  {
    path: 'documents/upload',
    component: UploadDocumentComponent,
    data: { title: 'Upload Documents', auth: [9] },
    canActivateChild: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'certificates',
    component: CertificatesComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Cetificates',auth: [120]  },
  },


  {
    path: 'certificates/upload-certificates-list',
    component: UploadCertificatesListComponent,
    data: { title: 'View Learner',auth: [120]  },
  },
  {
    path: 'certificates/upload-certificates-list/upload',
    component: AddCertificateComponent,
    data: { title: 'Upload Documents', auth: [120] },
    canActivateChild: [ AuthorizationGuard],
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
    path: 'digital-course-progress',
    component: DigitalCourseProgressComponent,
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
    path: 'programme-enrolment/viewProgram',
    component: ViewProgrammeEnrolmentComponent
  },    
  {
    path: 'staff-comments',
    component: StaffCommentsComponent,
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
    path: "professional-document",
    component: ProfessionalDocumentsComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'professional-document/upload-doc',
    component: UploadProfessionalDocumentComponent,
    data: { title: 'Upload Documents', auth: [9] },
    canActivateChild: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: "risk-assessment",
    component: RiskAssessmentComponent,
  },
  {
    path: "risk-assessment/edi-risk-assessment",
    component: EditRiskAssessmentComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: "referral",
    component: ReferralV2Component,
  },
  {
    path: 'referral/add-referral-v2',
    component: AddEditReferralV2Component,
  },
  {
    path: 'referral/edit-referral-v2',
    component: AddEditReferralV2Component,
  },

  {
    path: 'referral/view-referral-v2',
    component: ViewReferralV2Component,
  },
  {
    path: "readiness",
    component: JobReadinessComponent,
  },
  {
    path: 'system-interactions',
    component: SystemInteractionV2Component,
    data: { identifier:PageTitleIdentifier.system_interactions, auth:[118]},
  },
  {
    path: 'plan-v2/edit-plan',
    component: EditPlanComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [DeactivateGuard],
    data: { identifier:PageTitleIdentifier.system_interactions, auth:[123]},
  },
  {
    path: 'plan-v2/view-plan',
    component: ViewPlanComponent,
    data: { identifier:PageTitleIdentifier.system_interactions, auth:[123]},
  },
  {
    path: 'plan-v2/feedback-form',
    component: FeedbackReviewComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [DeactivateGuard],
    // data: { identifier:PageTitleIdentifier.system_interactions, auth:[123]},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipantV2RoutingModule { }
