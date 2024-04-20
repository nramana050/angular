import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../framework/material/material.module';
import { SharedModule } from '../..//framework/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageUsersComponent } from './manage-users.component';
import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { ChangeUserRoleComponent } from './change-user-role/change-user-role.component';
import { OrgSearchFilterModule } from '../shared/components/org-search-filter/org-search-filter.module';


@NgModule({
  declarations: [ManageUsersComponent, EditUserComponent, ViewUserComponent, ChangeUserRoleComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ManageUsersRoutingModule,
    OrgSearchFilterModule
  ]
})
export class ManageUsersModule { }
