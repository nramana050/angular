import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { ReportingComponent } from './reporting.component';
import { ReportsComponent } from './reports/reports.component';


const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    data: { title: 'Reports', auth: [42] },
    children: [
      {
        path: 'data-extract',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        data: { title: 'Data Extract', breadcrumb: '', preload: false, auth: [42], identifier:PageTitleIdentifier.Data_Extract},
        
      },]
  },
  {
    path: 'timespent',
    component: ReportingComponent,
    data: { title: 'Time Spent', reportName: "timespent", auth: [42] }
  },
  {
    path: ':reportName',
    component: ReportingComponent,
    data: { title: 'Dashboard', auth: [42], identifier:PageTitleIdentifier.Dashboard}
  },
  {
    path: 'contract-2',
    component: ReportingComponent,
    data: { title: 'Contract 2', reportName: "contract-2", auth: [42] }
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
