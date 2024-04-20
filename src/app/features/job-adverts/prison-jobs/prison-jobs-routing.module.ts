import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrisonJobsComponent } from './prison-jobs.component';
import { EditPrisonJobsComponent } from './edit-prison-jobs/edit-prison-jobs.component';
import { ViewPrisonJobsComponent } from './view-prison-jobs/view-prison-jobs.component';

const routes: Routes = [
  {
    path: '',
    component: PrisonJobsComponent,
    data: { title: 'Jobs', auth: [18,4] }
  },
  {
    path: 'edit-prison-jobs/:jobId',
    component: EditPrisonJobsComponent,
    data: { title: 'Edit Job', auth: [18,3]  }
  },
  {
    path: 'view-prison-jobs/:jobId',
    component: ViewPrisonJobsComponent,
    data: { title: 'Job Details', auth: [18,4]  }
  },
  {
    path: 'new-prison-jobs',
    component: EditPrisonJobsComponent,
    data: { title: 'Add Local Job', auth: [28,1] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrisonJobsRoutingModule { }
