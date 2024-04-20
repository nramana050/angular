import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalJobsComponent } from '../local-jobs/local-jobs.component';
import { OffenderFriendlyJobTabsComponent } from '../local-jobs/offender-friendly-job-tabs/offender-friendly-job-tabs.component';
import { ViewOFJobsExpressionOfInterestComponent } from '../local-jobs/view-ofjobs-expression-of-interest/view-ofjobs-expression-of-interest.component';
import { OFJobsExpressionOfInterestComponent } from './ofjobs-expression-of-interest.component';

const routes: Routes = [{
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
        component: OFJobsExpressionOfInterestComponent,
        data: { title: '', auth: [19] },
      },
      {
        path: 'jobs/view-job/:expressInterestNFNId',
        component: ViewOFJobsExpressionOfInterestComponent,
        data: { title: 'Expression of Interest Details', auth: [19, 4] }
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfjobsExpressionOfInterestRoutingModule { }
