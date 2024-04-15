import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileManagementRoutingModule } from './profile-management-routing.module';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
//NGX
import { NgImageSliderModule } from 'ng-image-slider';

@NgModule({
  declarations: [ProfileEditComponent],
  imports: [
    CommonModule,
    ProfileManagementRoutingModule,
    FormsModule,
    NgImageSliderModule
  ]
})
export class ProfileManagementModule { }
