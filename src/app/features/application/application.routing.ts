import { Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { ViewApplicationComponent } from './view-application/view-application.component';



export const ApplicationRoutes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    data: { title: 'Manage Applications', auth: [16] }
  },
  {
    path: 'view-application/:id',
    component: ViewApplicationComponent,
    data: { title: 'Application Details', auth: [16, 4] }
  },
];
