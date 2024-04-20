import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalJobsComponent } from './local-jobs.component';
import { JobAdvertViewNfnJobComponent } from './Wrapper/job-advert-view-local-job/job-advert-view-local-job.component';
import { EditLocalJobsComponent } from './edit-local-jobs/edit-local-jobs.component';
import { ViewNfnJobsComponent } from './view-local-jobs/view-local-jobs.component';
import { OffenderFriendlyJobTabsComponent } from './offender-friendly-job-tabs/offender-friendly-job-tabs.component';
import { OFJobsExpressionOfInterestComponent } from '../ofjobs-expression-of-interest/ofjobs-expression-of-interest.component';
import { ViewOFJobsExpressionOfInterestComponent } from './view-ofjobs-expression-of-interest/view-ofjobs-expression-of-interest.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

const routes: Routes = [
  {
    path: '',
    component: OffenderFriendlyJobTabsComponent,
    children: [

      
      {
        path: '',
        redirectTo: 'jobs',
        pathMatch: 'full'
      },
      {
        path: 'jobs',
        component: LocalJobsComponent,
        data: { title: '', auth: [19]},
      },
      {
        path: 'jobs/edit-local-jobs/:jobId',
        component: EditLocalJobsComponent,
        data: { title: 'Edit Job', auth: [19, 3],identifier:PageTitleIdentifier.Edit_Job}
      },
      {
        path: 'jobs/new-local-jobs',
        component: EditLocalJobsComponent,
        data: { title: 'Add Local Job', auth: [19, 1], identifier:PageTitleIdentifier.Add_Local_Job}
      },
      {
        path: 'jobs/view-local-jobs/:jobId',
        component: JobAdvertViewNfnJobComponent,
        data: {title: 'Job Details', auth: [19, 4], identifier:PageTitleIdentifier.Job_Details}
      },
    ]
  },
  {  
    path: 'su-view-local-jobs/:jobId',
    component: ViewNfnJobsComponent,
    data: {auth: [19, 4] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalJobsRoutingModule { }
