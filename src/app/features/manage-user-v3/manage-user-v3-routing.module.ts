import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageTitleIdentifier } from "src/app/framework/constants/PageTitleIdentifier-constants";
import { ManageUserV3Component } from "./manage-user-v3.component";
import { EditUserComponent } from "./edit-user-v3/edit-user.component";
import { ViewUserComponent } from "./view-user-v3/view-user.component";

const routes: Routes = [

    {
      path: '',
      component: ManageUserV3Component,
      data: { title: 'Title for Manage Users'},
    //   canActivate: [AuthorizationGuard],
    },  {
      path: 'new-user',
      component: EditUserComponent,
      data: { title: 'Create New User',  identifier:PageTitleIdentifier.Create_New_User},
      // canActivate: [AuthorizationGuard],
    },  {
      path: 'view-user/:id',
      component: ViewUserComponent,
      data: { title: 'View User', auth:[5,2], identifier:PageTitleIdentifier.View_User},
      // canActivate: [AuthorizationGuard],
    },
    {
      path: 'edit-user/:id',
      component: EditUserComponent,
      data: { title: 'Edit User', auth:[5,3], identifier:PageTitleIdentifier.Edit_User },
      // canActivate: [AuthorizationGuard],
    },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  })
  export class manageUserV3RoutingModule { }
  