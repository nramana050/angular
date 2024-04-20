import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationRoutes } from './application.routing';
import { ApplicationComponent } from './application.component';
import { ApplicationService } from './application.service';
import { PaginationService } from '../assessment/publish-assessment/publish-assessment.pagination';
import { ViewApplicationComponent } from './view-application/view-application.component';
import { DocumentsService } from '../service-user/documents/documents.service';
import { ServiceUserService } from '../service-user/service-user.service';
import { MaterialModule } from '../../framework/material/material.module';
import { AppConfirmModule } from '../../framework/components/app-confirm/app-confirm.module';
import { FeatureAllowModule } from '../../framework/directives/features-allow.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FilterPipeModule } from '../../framework/pipes/filter.module';
import { SnackBarService } from '../../framework/service/snack-bar.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    AppConfirmModule,
    FeatureAllowModule,
    MatExpansionModule,
    RouterModule.forChild(ApplicationRoutes),
    FilterPipeModule
  ],
  declarations: [
    ApplicationComponent,
    ViewApplicationComponent
  ],
  providers: [ApplicationService,
    DocumentsService,
    ServiceUserService,
    SnackBarService,
     PaginationService],
  entryComponents: [ ]
})
export class ApplicationModule { }
