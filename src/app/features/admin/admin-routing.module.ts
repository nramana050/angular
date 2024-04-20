import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { AdminComponent } from './admin.component';
import { CourseSetupComponent } from './course-setup/course-setup.component';
import { ProviderSetupComponent } from './provider-setup/provider-setup.component';
import { QualificationSetupComponent } from './qualification-setup/qualification-setup.component';
import { ResourceSetupComponent } from './resource-setup/resource-setup.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    data: { title: 'Admin' },
    redirectTo: 'provider-setup',
    pathMatch: 'full'
  },
  // {
  //   path: 'resource-setup',
  //   component: ResourceSetupComponent,
  //   data: { title: '' }
  // },
  {
    path: 'course-setup',
    component: CourseSetupComponent,
    data: { title: 'Admin', identifier:PageTitleIdentifier.ADMIN},
  },
  {
    path: 'provider-setup',
    component: ProviderSetupComponent,
    data: { title: 'Admin', identifier:PageTitleIdentifier.ADMIN},
  },
  {
    path: 'qualification-setup',
    component: QualificationSetupComponent,
    data: { title: 'Admin', identifier:PageTitleIdentifier.ADMIN},
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
