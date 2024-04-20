import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { AuthenticationGuard } from '../framework/guards/authentication.guard';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleIdentifier } from '../framework/constants/PageTitleIdentifier-constants';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'home'},
    // canActivateChild: [AuthenticationGuard],
    children : [
      // {
      //   path: 'programme-management', loadChildren: () => import('../features/programme-management/programme-management.module').then(m => m.ProgrammeManagementModule),
      //   data: { title: 'Programme Management', breadcrumb: '', preload: false, auth: [50], identifier:PageTitleIdentifier.Programme_Management}
      // },
      // {
      //   path: 'learners', loadChildren: () => import('../features/learners/learners.module').then(m => m.LearnersModule),
      //   data: { title: 'Learners', breadcrumb: '', preload: false, auth: [50]}
      // },
      // {
      //   path: 'manage-users', loadChildren: () => import('../features/manage-users/manage-users.module').then(m => m.ManageUsersModule),
      //   data: { title: 'Manage Users', breadcrumb: '', preload: false,auth: [5], identifier:PageTitleIdentifier.Manage_Users}
      // },
      // {
      //   path: 'user-setting', loadChildren: () => import('../features/user-settings/user-settings.module').then(m => m.UserSettingsModule),
      //   data: { title: 'User Settings', breadcrumb: '', preload: false}
      // },
      // {
      //   path: 'customers', loadChildren: () => import('../features/customers/customers.module').then(m => m.CustomersModule),
      //   data: { title: 'Customers', breadcrumb: '', preload: false, auth: [49], identifier:PageTitleIdentifier.CUSTOMERS}
      // },
      // {
      //   path: 'attendance', loadChildren: () => import('../features/attendance/attendance.module').then(m => m.AttendanceModule),
      //   data: { title: 'Attendance', breadcrumb: '', preload: false, auth: [1], identifier:PageTitleIdentifier.Attendance}
      // },
      // {
      //   path: 'admin', loadChildren: () => import('../features/admin/admin.module').then(m => m.AdminModule),
      //   data: { title: 'Admin', breadcrumb: '', preload: false, auth: [15], identifier:PageTitleIdentifier.ADMIN}
      // },
      // {
      //   path: 'assessment-builder', loadChildren: () => import('../features/assessment/assessment.module').then(m => m.AssessmentModule),
      //   data: { title: 'Asset builder', breadcrumb: '', preload: false, identifier:PageTitleIdentifier.Asset_builder}
      // },
      // {
      //   path: 'captr-learner', loadChildren: () => import('../features/captr-learners/captr-learners.module').then(m => m.CaptrLearnersModule),
      //   data: { title: 'Participants', breadcrumb: '', preload: false, auth: [9], identifier:PageTitleIdentifier.Participants}
      // },
      // {
      //   path: 'content-management', loadChildren: () => import('../features/content-management/content-management.module').then(m => m.ContentManagementModule),
      //   data: { title: 'Manage Resources', breadcrumb: '', preload: false, identifier:PageTitleIdentifier.Manage_Resources}
      // },
      // {
      //   path: 'administration', loadChildren: () => import('../features/administration/administration.module').then(m => m.AdministrationModule),
      //   data: {title: '', breadcrumb: '', preload: false ,  auth: [15]}
      // },
      // {
      //   path: 'application-setup/manage-organisations', loadChildren: () => import('./../features/manage-organisations/manage-organisations.module').then(m => m.ManageOrganisationsModule),
      //   data: { title: 'Manage Organisations', breadcrumb: '', preload: false, identifier:PageTitleIdentifier.Manage_Organisations}
      // },
      // {
      //   path: 'job-advert', loadChildren: () => import('../features/job-adverts/job-adverts.module').then(m => m.JobAdvertsModule),
      //   data: { title: 'job Advert', breadcrumb: '', preload: false,  identifier:PageTitleIdentifier.Job_Adverts }
      // },
      // {
      //   path: 'captr-learner', loadChildren: () => import('../features/captr-learners/captr-learners.module').then(m => m.CaptrLearnersModule),
      //   data: { title: 'Learners', breadcrumb: '', preload: false, auth: [49]}
      // },
      // {
      //   path: 'course-admin', loadChildren: () => import('../features/admin/admin.module').then(m => m.AdminModule),
      //   data: { title: 'Admin', breadcrumb: '', preload: false, auth: [59]}
      // },
      // {
      //   path: 'dashboard', loadChildren: () => import('../features/reporting/reporting.module').then(m => m.ReportingModule),
      //   data: { title: 'Reporting and Dashboards', breadcrumb: '', preload: false , auth: [37], identifier:PageTitleIdentifier.Reporting_and_Dashboards}
      // },
     
      // {
      //   path: 'srm', loadChildren: () => import('../features/srm/srm.module').then(m => m.SrmModule),
      //   data: { title: 'Messages', breadcrumb: '', preload: false}
      // },
      // {
      //   path: 'upload', loadChildren: () => import('../features/upload-csv/upload-csv.module').then(m => m.UploadCsvModule),
      //   data: { title: 'Upload', breadcrumb: '', preload: false, identifier:PageTitleIdentifier.Upload}
      // },
      // {
      //   path: 'application-setup', loadChildren: () => import('../features/application-setup/application-setup.module').then(m => m.ApplicationSetupModule),
      //   data: { title: 'Application Set Up', breadcrumb: '', preload: false, identifier:PageTitleIdentifier.Application_set_up}
      // },
      {
        path: 'genaie', loadChildren:() => import('../features/genaie/genaie.module').then(m => m.genaieModule),
        data: { title: 'GENAIE', breadcrumb: '', preload: false,  identifier:PageTitleIdentifier.GENAIE}
      },
      
      // {
      //   path: 'hmpps-learner', loadChildren: () => import('../features/hmpps-learners/hmpps-learners.module').then(m => m.HmppsLearnersModule),
      //   data: { title: 'Participants', breadcrumb: '', preload: false}
      // },
      // {
      //   path: 'digital-courses', loadChildren: () => import('../features/digital-courses/digital-courses.module').then(m => m.DigitalCoursesModule),
      //   data: { title: 'Digital courses', breadcrumb: '', preload: false, identifier:PageTitleIdentifier.Digital_courses}
      // },
      // {
      //   path: 'person-supported', loadChildren: () => import('../features/participant-v2/participant-v2.module').then(m => m.ParticipantV2Module),
      //   data: { title: 'Person Supported', breadcrumb: '', preload: false, auth: [97]}
      // },
      // {
      //   path: 'mentivity-learner', loadChildren: () => import('../features/mentivity-learners/mentivity-learners.module').then(m => m.MentivityLearnersModule),
      //   data: { title: 'Participants', breadcrumb: '', preload: false}
      // },    
      // {
      //   path: 'caseload-overview', loadChildren: () => import('../features/caseload-overview/caseload-overview.module').then(m => m.CaseloadOverviewModule),
      //   data: { title: 'Caseload Overview', breadcrumb: '', preload: false, auth: [111]}
      // },
      // {   
      //   path: 'clink-learners', loadChildren: () => import('../features/participant-v4/participant-v4.module').then(m => m.ParticipantV4Module),
      //   data: { title: 'Graduates', breadcrumb: '', preload: false, auth: [113]}
      // },          
      // {
      //   path: 'v2/manage-users', loadChildren: () => import('../features/manage-user-v2/manage-user-v2.module').then(m => m.ManageUserV2Module),
      //   data: { title: 'Manage Users', breadcrumb: '', preload: false, auth: [131],identifier:PageTitleIdentifier.Manage_Users}
      // },
      // {
      //   path: 'v3/manage-users', loadChildren: () => import('../features/manage-user-v3/manage-user-v3.module').then(m => m.ManageUserV3Module),
      //   data: { title: 'Staff Users', breadcrumb: '', preload: false, auth: [133],identifier:PageTitleIdentifier.Manage_Users}
      // },
      // {   
      //   path: 'rws-participant', loadChildren: () => import('../features/participant-v6/participant-v6.module').then(m => m.ParticipantV6Module),
      //   data: { title: 'Participants', breadcrumb: '', preload: false, auth: [136]}
      // },
      // {
      //   path: 'rws-content-management', loadChildren: () => import('../features/rws-content-management/rws-content-management.module').then(m => m.RwsContentManagementModule),
      //   data: { title: 'Manage Resources', breadcrumb: '', preload: false, identifier:PageTitleIdentifier.Manage_Resources}
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
