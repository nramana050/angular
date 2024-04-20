import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from 'src/app/framework/guards/authorization.guard';
import { CanDeactivateGuard } from 'src/app/framework/guards/can-deactivate/can-deactivate.guard';
import { CompleteAssessmentComponent } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessment/complete-assessment.component';
import { CompleteAssessmentsTabsComponent } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments-tabs/complete-assessments-tabs.component';
import { CompleteAssessmentsComponent } from '../captr-learners/view-captr-learner/complete-assessments/complete-assessments.component';
import { ViewCompleteAssessmentComponent } from '../captr-learners/view-captr-learner/complete-assessments/view-assessment/view-assessment.component';
import { FavouritesJobsComponent } from '../captr-learners/view-captr-learner/job-activity/favourites-jobs/favourites-jobs.component';
import { JobActivityComponent } from '../captr-learners/view-captr-learner/job-activity/job-activity.component';
import { JobApplicationsComponent } from '../captr-learners/view-captr-learner/job-activity/job-applications/job-applications.component';
import { LocalJobsComponent } from '../captr-learners/view-captr-learner/job-activity/local-jobs/local-jobs.component';
import { ViewFavouritesJobsComponent } from '../captr-learners/view-captr-learner/job-activity/view-favourites-job/view-favourites-jobs/view-favourites-jobs.component';
import { CourseLaunchComponent } from '../captr-learners/view-captr-learner/participant-learning/digital-course-progress/course-launch/course-launch.component';
import { DigitalCourseProgressComponent } from '../captr-learners/view-captr-learner/participant-learning/digital-course-progress/digital-course-progress.component';
import { ProgrammeEnrolmentComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-enrolment/programme-enrolment.component';
import { ViewProgrammeEnrolmentComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-enrolment/view-programme-enrolment/view-programme-enrolment.component';
import { EditPerformanceReviewAssessmentComponent } from '../captr-learners/view-captr-learner/performance-review/edit-performance-review-assessment/edit-performance-review-assessment.component';
import { PerformanceReviewComponent } from '../captr-learners/view-captr-learner/performance-review/performance-review.component';
import { ViewPerformanceReviewAssessmentComponent } from '../captr-learners/view-captr-learner/performance-review/view-performance-review-assessment/view-performance-review-assessment.component';
import { PlanContentCardComponent } from '../captr-learners/view-captr-learner/plan-content-card/plan-content-card.component';
import { ProfessionalDocumentsComponent } from '../captr-learners/view-captr-learner/professional-documents/professional-documents.component';
import { UploadProfessionalDocumentComponent } from '../captr-learners/view-captr-learner/professional-documents/upload-professional-document/upload-professional-document.component';
import { SystemInteractionsComponent } from '../captr-learners/view-captr-learner/system-interactions/system-interactions.component';
import { TimelineSystemInteractionComponent } from '../captr-learners/view-captr-learner/system-interactions/timeline-system-interaction/timeline-system-interaction.component';
import { AddEditUsefulContactsComponent } from '../captr-learners/view-captr-learner/useful-contacts/add-edit-useful-contacts/add-edit-useful-contacts.component';
import { UsefulContactsComponent } from '../captr-learners/view-captr-learner/useful-contacts/useful-contacts.component';
import { ViewUsefulContactsComponent } from '../captr-learners/view-captr-learner/useful-contacts/view-useful-contacts/view-useful-contacts.component';
import { LearnerOutcomeComponent } from '../learners/add-learner/learner-outcome/learner-outcome.component';
import { AddOutcomeComponent } from '../learners/add-learner/learner-outcome/outcome-list/add-outcome/add-outcome.component';
import { OutcomeListComponent } from '../learners/add-learner/learner-outcome/outcome-list/outcome-list.component';
import { EnrolmentDetailsComponent } from '../captr-learners/enrolment-details/enrolment-details.component';
import { ViewUserCvComponent } from '../captr-learners/view-captr-learner/view-user-cv/view-user-cv.component';
import { CheckAnswerComponent } from '../captr-learners/view-captr-learner/plan-induction/check-answer/check-answer.component';
import { ProgrammeOutcomesComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes.component';
import { ProgrammeOutcomesListComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/programme-outcomes-list.component';
import { ViewProgrammeOutcomeComponent } from '../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/view-programme-outcome/view-programme-outcome.component';
import { ViewFurtherInfoComponent } from './view-participant-v4/view-further-info/view-further-info.component';
import { ClinkFurtherInformationComponent } from './further-information/clink-further-information.component';
import { ActionPlanInductionComponent } from './view-participant-v4/action-plan-induction/action-plan-induction.component';
import { ParticipantV4Component } from './participant-v4.component';
import { AddEditParticipantV4Component } from './add-edit-participant-v4/add-edit-participant-v4.component';
import { ParticipantProfessionalViewComponent } from './participant-professional-view/participant-professional-view.component';
import { AddReferralComponent } from './view-participant-v4/clink-referral/add-referral/add-referral.component';
import { ViewReferralComponent } from './view-participant-v4/clink-referral/view-referral/view-referral.component';
import { AddEditCaseNoteComponent }  from '../mentivity-learners/view-mentivity-learners/case-note/add-edit-case-note/add-edit-case-note.component';
import { PrintCaseNotesComponent } from '../mentivity-learners/view-mentivity-learners/case-note/print-case-notes/print-case-notes.component';
import { CaseNoteComponent } from '../mentivity-learners/view-mentivity-learners/case-note/case-note.component';
import { CaseNotesComponent } from '../mentivity-learners/view-mentivity-learners/case-note/case-notes/case-notes.component';
import { ViewCaseNoteComponent } from '../mentivity-learners/view-mentivity-learners/case-note/view-case-note/view-case-note.component';
import { ViewProfileComponent } from './view-participant-v4/view-profile/view-profile.component';
import { ClinkReferralComponent } from './view-participant-v4/clink-referral/clink-referral.component';
import { RiskAssessmentComponent } from './view-participant-v4/risk-assessment/risk-assessment.component';
import { EditRiskAssessmentComponent } from './view-participant-v4/edit-risk-assessment/edit-risk-assessment.component';
import { RiskAssessmentDocumentComponent } from './view-participant-v4/risk-assessment-document/risk-assessment-document.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';


const caseNote = 'case-note';
const routes: Routes = [
  {
    path: '',
    component: ParticipantV4Component,
    // canActivate: [],
    data: { title: ''},
  },
  {
    path: 'new-learner',
    component: AddEditParticipantV4Component,    
    data: { title: 'Add Graduate'},
  },
  {
    path: 'edit-learner',
    component: AddEditParticipantV4Component,
    data: { title: 'Edit Graduate' }
  },
  {
    path: 'enrolment-details',
    component: EnrolmentDetailsComponent,
    data: { title: 'Enrolment' , auth:[50]},
  },
  {
    path: "cv",
    component: ViewUserCvComponent,
  },
  {
    
    path: 'further-information'  ,
    component: ClinkFurtherInformationComponent,
    data: { title: 'Further information '},
  },
  {
    path: "profile/check-answer",
    component: CheckAnswerComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'learner-outcome',
    component: LearnerOutcomeComponent,
    data: { title: 'Employment Outcome' }
  },
  {
    path: 'participant-professional-view',
    component : ParticipantProfessionalViewComponent,
    data:{title: 'View Graduate'},
  },
  {
    path: 'profile',
    component: ViewProfileComponent,
    data: {title: 'Graduates Profile'}
  },
{
     path: 'profile/action-plan',
    component: ActionPlanInductionComponent,
},
{
  path: 'plan',
  component: PlanContentCardComponent,
},
{
  path: "assessments/edit",
  component: CompleteAssessmentComponent,
},
{
  path: "cv",
  component: ViewUserCvComponent,
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
      // data: { auth: [19] },
      // canActivateChild: [AuthenticationGuard, AuthorizationGuard],
    },]
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
    path: "risk-assessment/risk-assessment-document",
    component: RiskAssessmentDocumentComponent,
  },
  {
    path: 'case-note',
    component: CaseNoteComponent,
    children: [
      {
        path: '',
        redirectTo: caseNote,
        pathMatch: 'full',
      },
      {
        path: caseNote,
        component: CaseNotesComponent,
             },
      {
        path: 'case-note/view-case-note',
        component: ViewCaseNoteComponent,
      },
      {
        path: 'case-note/print-case-notes',
        component: PrintCaseNotesComponent,
      },
      {
        path: 'case-note/add-case-note',
        component: AddEditCaseNoteComponent,
      },

    ]
  },
  {
    path: "professional-document",
    component: ProfessionalDocumentsComponent,
  },
  {
    path: 'professional-document/upload-doc',
    component: UploadProfessionalDocumentComponent,
  },
  {
    path: 'referral',
    component: ClinkReferralComponent,    
  },

  {
    path: 'referral/add-referral',
    component: AddReferralComponent,
  },
  {
    path: 'referral/edit-referral',
    component: AddReferralComponent,
  },

  {
    path: 'referral/view-referral',
    component: ViewReferralComponent,
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
    path: 'performance-review',
    component: PerformanceReviewComponent,
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
    // canActivate: [AuthorizationGuard],
    // data: { title: 'digital-course-progress' , auth:[89]},
  },
  {
    path: 'digital-course-progress/programme-enrolment',
    component: ProgrammeEnrolmentComponent,
    data: { auth: [50] },
  },
  {
    path: 'digital-course-progress/programme-outcomes',
    component: ProgrammeOutcomesComponent,
    data: { auth: [50] },
  },
  {
    path: 'programme-enrolment',
    component: ProgrammeEnrolmentComponent,
  },
  {

    path: 'programme-enrolment/viewProgram',
    component: ViewProgrammeEnrolmentComponent
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
    path: 'digital-course-progress/courseLaunch/:courseId',
    component: CourseLaunchComponent,
    canActivate: [AuthorizationGuard],
    // data: { title: 'digital-course-progress' , auth:[89]},
  }, 
  {
    path: 'digital-course-progress/programme-outcomes',
    component: ProgrammeOutcomesComponent,
    // data: { auth: [50] },
  },
  {
    path: 'digital-course-progress/programme-enrolment/viewProgram',
    component: ViewProgrammeEnrolmentComponent
  },
  {
    path: 'digital-course-progress/programme-outcomes/programme-outcome-list',
    component: ProgrammeOutcomesListComponent
  },
  {
    path: 'digital-course-progress/programme-outcomes/programme-outcome-list/view-programme-outcome',
    component: ViewProgrammeOutcomeComponent,
    data: { title: 'View Outcome'},
  },
 
  {
    path: 'programme-enrolment/viewProgram',
    component: ViewProgrammeEnrolmentComponent
  },
  {
    path : 'profile/view-further-info',
    component: ViewFurtherInfoComponent
  },
  {
    path: 'learner-outcome',
    component: LearnerOutcomeComponent,
    data: { title: 'Employment Outcome' }
  },
  {
    path: 'learner-outcome/outcome-list',
    component: OutcomeListComponent,
    data: { title: 'Outcome List'},
  },
  {
    path: 'learner-outcome/outcome-list/add-outcome',
    component: AddOutcomeComponent,
    data: { title: 'Add Outcome'},
  },
  {
    path: 'learner-outcome/outcome-list/edit-outcome',
    component: AddOutcomeComponent,
    data: { title: 'Edit Outcome'},
  },
  
         
  ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipantV4RoutingModule { }
