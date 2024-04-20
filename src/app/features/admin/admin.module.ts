import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ResourceSetupComponent } from './resource-setup/resource-setup.component';
import { AdminNavigation } from './admin-nav';
import { CourseSetupComponent } from './course-setup/course-setup.component';
import { MaterialModule } from '../../framework/material/material.module';
import { SharedModule } from '../../framework/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AddResourceComponent } from './resource-setup/add-resource/add-resource.component';
import { ProviderSetupComponent } from './provider-setup/provider-setup.component';
import { QualificationSetupComponent } from './qualification-setup/qualification-setup.component';
import { AddProviderComponent } from './provider-setup/add-provider/add-provider.component';
import { AddCourseComponent } from './course-setup/add-course/add-course.component';
import { AddQualificationComponent } from './qualification-setup/add-qualification/add-qualification.component';

@NgModule({
  declarations: [
    ResourceSetupComponent,
    CourseSetupComponent,
    AddResourceComponent,
    AddCourseComponent,
    ProviderSetupComponent,
    QualificationSetupComponent,
    AddProviderComponent,
    AddQualificationComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AdminNavigation]
})
export class AdminModule { }
