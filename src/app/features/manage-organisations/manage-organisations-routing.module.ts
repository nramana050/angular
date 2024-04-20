import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from '../../framework/guards/authorization.guard';
import { AuthenticationGuard } from '../../framework/guards/authentication.guard';
import { ManageOrganisationsComponent } from './manage-organisations.component';
import { AddEditOrganisationComponent } from './add-edit-organisation/add-edit-organisation.component';
import { ViewOrganisationComponent } from './view-organisation/view-organisation.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

const routes: Routes = [
  {
    path: '',
    component: ManageOrganisationsComponent,
    data: { title: 'Manage Organisations', preload: false, auth: [44], identifier:PageTitleIdentifier.Manage_Organisations},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'view-organisation/:id',
    component: ViewOrganisationComponent,
    data: { title: 'View Organisation', preload: false, auth: [44],  identifier:PageTitleIdentifier},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'edit-organisation/:id',
    component: AddEditOrganisationComponent,
    data: { title: 'Edit Organisation', preload: false, auth: [44], identifier:PageTitleIdentifier.Edit_Organisation},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'new-organisation',
    component: AddEditOrganisationComponent,
    data: { title: 'Create New Organisation', preload: false, auth: [44],  identifier:PageTitleIdentifier.Create_New_Organisation},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageOrganisationsRoutingModule { }
