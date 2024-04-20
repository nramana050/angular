import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssessmentComponent } from './assessment.component';
import { AuthorizationGuard } from '../../framework/guards/authorization.guard';
import { ViewAssessmentComponent } from './view-assessment/view-assessment.component';
import { EditAssessmentComponent } from './edit-assessment/edit-assessment.component';
import { PublishAssessmentComponent } from './publish-assessment/publish-assessment.component';
import { AssessmentDashboardComponent } from './assessment-dashboard/assessment-dashboard.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';



 const AssessmentRoutes: Routes = [
  {
    path: '',
    component: AssessmentComponent,
    data: { title: 'Asset Builder', auth: [6] }
  },
  {
    path: 'edit-assessment/:assessmentTemplateId',
    component: EditAssessmentComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Edit Asset', auth: [6, 3], identifier:PageTitleIdentifier.Edit_Asset  }
  },
  {
    path: 'view-assessment/:assessmentTemplateId',
    component: ViewAssessmentComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'View Asset', auth: [6, 2], identifier:PageTitleIdentifier.View_Asset }
  },
  {
    path: 'new-assessment',
    component: EditAssessmentComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Add New Asset', auth: [6, 1], identifier:PageTitleIdentifier.Add_New_Asset }
  },
  {
    path: 'publish-assessment',
    component: PublishAssessmentComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Publish Asset', auth: [6, 6] }
  },
  {
    path :'dashboard/:id',
    component:AssessmentDashboardComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Asset Dashboard', auth: [6, 6], identifier:PageTitleIdentifier.Asset_Dashboard }

  }
];
@NgModule({
  imports: [RouterModule.forChild(AssessmentRoutes)],
  exports: [RouterModule]
})
export class AssessmentRoutingModule { }