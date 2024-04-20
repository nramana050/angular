import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ParticipantV6Component } from "./participant-v6.component";
import { AddEditParticipantV6Component } from "./add-edit-participant-v6/add-edit-participant-v6.component";
import { ParticipantProfessionalViewComponent } from "./participant-professional-view/participant-professional-view.component";
import { ViewProfileComponent } from "./view-participant-v6/view-profile/view-profile.component";
import { PageTitleIdentifier } from "src/app/framework/constants/PageTitleIdentifier-constants";
import { AuthorizationGuard } from "src/app/framework/guards/authorization.guard";
import { CaseNoteComponent } from "../../features/captr-learners/view-captr-learner/case-note/case-note.component";
import { CaseNotesComponent } from '../../features/captr-learners/view-captr-learner/case-note/case-notes/case-notes.component';
import { AuthenticationGuard } from 'src/app/framework/guards/authentication.guard';
import { AddOrEditCaseNotesComponent } from '../../features/captr-learners/view-captr-learner/case-note/add-or-edit-case-notes/add-or-edit-case-notes.component';
import { ViewCaseNoteComponent } from '../../features/captr-learners/view-captr-learner/case-note/view-case-note/view-case-note.component';
import { CompleteAssessmentsTabsComponent } from "../captr-learners/view-captr-learner/complete-assessments/complete-assessments-tabs/complete-assessments-tabs.component";
import { CompleteAssessmentsComponent } from "../captr-learners/view-captr-learner/complete-assessments/complete-assessments.component";
import { CompleteAssessmentComponent } from "../captr-learners/view-captr-learner/complete-assessments/complete-assessment/complete-assessment.component";
import { ViewCompleteAssessmentComponent } from "../captr-learners/view-captr-learner/complete-assessments/view-assessment/view-assessment.component";
import { UploadDocumentComponent } from "../captr-learners/view-captr-learner/documents/upload-document/upload-document.component";
import { DocumentsComponent } from "../captr-learners/view-captr-learner/documents/documents.component";
import { DigitalCourseProgressComponent } from "../captr-learners/view-captr-learner/participant-learning/digital-course-progress/digital-course-progress.component";
import { ViewProgrammeEnrolmentComponent } from "../captr-learners/view-captr-learner/participant-learning/programme-enrolment/view-programme-enrolment/view-programme-enrolment.component";
import { ProgrammeOutcomesListComponent } from "../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/programme-outcomes-list.component";
import { ViewProgrammeOutcomeComponent } from "../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes-list/view-programme-outcome/view-programme-outcome.component";
import { ProgrammeOutcomesComponent } from "../captr-learners/view-captr-learner/participant-learning/programme-outcomes/programme-outcomes.component";
import { ProgrammeEnrolmentComponent } from "../captr-learners/view-captr-learner/participant-learning/programme-enrolment/programme-enrolment.component";
import { CourseLaunchComponent } from "../captr-learners/view-captr-learner/participant-learning/digital-course-progress/course-launch/course-launch.component";
import { SystemInteractionsComponent } from "../captr-learners/view-captr-learner/system-interactions/system-interactions.component";
import { TimelineSystemInteractionComponent } from "../captr-learners/view-captr-learner/system-interactions/timeline-system-interaction/timeline-system-interaction.component";
import { SystemInteractionV2Component } from "../participant-v2/view-participant/system-interaction-v2/system-interaction-v2.component";


const caseNote = 'case-note';
const routes: Routes = [
    {
      path: '',
      component: ParticipantV6Component,
      // canActivate: [],
      data: { title: ''},
    },
    {
      path: 'new-participant',
      component: AddEditParticipantV6Component,    
      data: { title: 'Add participant'},
    },
    {
      path: 'edit-participant',
      component: AddEditParticipantV6Component,
      data: { title: 'Edit participant' }
    },
    {
      path: 'participant-professional-view',
      component : ParticipantProfessionalViewComponent,
      data:{title: 'View Participant'},
    },
    {
      path: 'profile',
      component: ViewProfileComponent,
      data: {title: 'Participants Profile'}
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
    },  {
      path: 'documents',
      component: DocumentsComponent,
      data: { title: 'View Learner', identifier:PageTitleIdentifier.Documents },
    },
    {
      path: 'documents/upload',
      component: UploadDocumentComponent,
      data: { title: 'Upload Documents',  identifier:PageTitleIdentifier.Documents  },
      canActivateChild: [AuthenticationGuard, AuthorizationGuard],
    },
    {
      path: 'digital-course-progress',
      component: DigitalCourseProgressComponent,
      canActivate: [AuthorizationGuard],
      data: { title: 'digital-course-progress' , auth:[89], identifier:PageTitleIdentifier.digital_course_progress},
    },{
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
      component: SystemInteractionV2Component,
      data: { identifier:PageTitleIdentifier.system_interactions, auth:[118]},
    },
    {
      path: 'system-interactions/timeline-system-interaction',
      component: TimelineSystemInteractionComponent,
    },
    ]
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ParticipantV6RoutingModule { }
  