
import { Routes } from '@angular/router';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { JobAdvertsComponent } from './job-adverts.component';

export const JobAdvertsRoutes: Routes = [
  {
    path: '',
    component: JobAdvertsComponent,
    data: { title: 'Job Adverts', auth: [17,4],  identifier:PageTitleIdentifier.Job_Adverts},
    children: [
     {
        path: 'local-jobs',
        loadChildren: () => import('./local-jobs/local-jobs.module').then(m => m.LocalJobsModule),
        data: { title: 'Jobs', breadcrumb: '', preload: false, auth: [19,4],  identifier:PageTitleIdentifier.Jobs },
      },  
      {
        path: 'expression-of-interest',
        loadChildren: () => import('./ofjobs-expression-of-interest/ofjobs-expression-of-interest.module').then(m => m.OfjobsExpressionOfInterestModule),
        data: { title: 'Jobs', breadcrumb: '', preload: false, auth: [19,4], identifier:PageTitleIdentifier.Jobs },
      },  
    ],
  
  }
];
