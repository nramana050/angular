import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageUserV2Component } from "./manage-user-v2.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { PageTitleIdentifier } from "src/app/framework/constants/PageTitleIdentifier-constants";
import { ViewUserComponent } from "./view-user/view-user.component";

const routes: Routes = [

    {
      path: '',
      component: ManageUserV2Component,
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
  export class manageUserV2RoutingModule { }
  