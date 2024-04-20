import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from './edit-user-v3/edit-user.component';
import { manageUserV3RoutingModule } from './manage-user-v3-routing.module';
import { ManageUserV3Component } from './manage-user-v3.component';
import { ViewUserComponent } from './view-user-v3/view-user.component';


@NgModule({
  declarations: [ManageUserV3Component, EditUserComponent, ViewUserComponent ],
  imports: [
    CommonModule,
    manageUserV3RoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ManageUserV3Module { }
