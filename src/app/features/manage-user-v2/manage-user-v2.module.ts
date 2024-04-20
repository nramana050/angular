import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ManageUserV2Component } from  './manage-user-v2.component';
import { manageUserV2RoutingModule } from './manage-user-v2-routing.module';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { OrgSearchFilterModule } from '../shared/components/org-search-filter/org-search-filter.module';


@NgModule({
  declarations: [ManageUserV2Component, EditUserComponent, ViewUserComponent],
  imports: [
    CommonModule,
    manageUserV2RoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    OrgSearchFilterModule
  ]
})
export class ManageUserV2Module { }
