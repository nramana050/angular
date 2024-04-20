import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ManageUsersComponent } from './manage-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AuthorizationGuard } from '../../framework/guards/authorization.guard';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';


const routes: Routes = [

  {
    path: '',
    component: ManageUsersComponent,
    data: { title: 'Title for Manage Users', auth:[5]},
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'view-user/:id',
    component: ViewUserComponent,
    data: { title: 'View User', auth:[5,2], identifier:PageTitleIdentifier.View_User},
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'edit-user/:id',
    component: EditUserComponent,
    data: { title: 'Edit User', auth:[5,3], identifier:PageTitleIdentifier.Edit_User },
    canActivate: [AuthorizationGuard],
  },
  {
    path: 'new-user',
    component: EditUserComponent,
    data: { title: 'Create New User', auth:[5,1], identifier:PageTitleIdentifier.Create_New_User},
    canActivate: [AuthorizationGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageUsersRoutingModule { }
