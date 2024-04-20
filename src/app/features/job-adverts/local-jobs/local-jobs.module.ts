import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalJobsRoutingModule } from './local-jobs-routing.module';
import { LocalJobsComponent } from './local-jobs.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FeatureAllowModule } from '../../../framework/directives/features-allow.module';
import { FilterPipeModule } from '../../../framework/pipes/filter.module';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { LocalJobsService } from './local-jobs.service';
import { JobAdvertViewNfnJobComponent } from './Wrapper/job-advert-view-local-job/job-advert-view-local-job.component';
import { ExpressionsOfInterestComponent } from './expressions-of-interest/expressions-of-interest.component';
import { MaterialModule } from '../../../framework/material/material.module';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { EditLocalJobsComponent } from './edit-local-jobs/edit-local-jobs.component';
import { ViewNfnJobsComponent } from './view-local-jobs/view-local-jobs.component';
import { OffenderFriendlyJobTabsComponent } from './offender-friendly-job-tabs/offender-friendly-job-tabs.component';
import { ViewOFJobsExpressionOfInterestComponent } from './view-ofjobs-expression-of-interest/view-ofjobs-expression-of-interest.component';
import { LearnerNavigation } from '../../captr-learners/view-captr-learner/learner-nav';
import { ApplicationService } from '../../application/application.service';
import { DocumentsService } from '../../captr-learners/view-captr-learner/documents/documents.service';


@NgModule({
  declarations: [LocalJobsComponent, EditLocalJobsComponent, ViewNfnJobsComponent,
    JobAdvertViewNfnJobComponent, ExpressionsOfInterestComponent,
   OffenderFriendlyJobTabsComponent],
  imports: [
    CommonModule,
    LocalJobsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FeatureAllowModule,
    FilterPipeModule
  ],
  providers: [LocalJobsService,
    SnackBarService,
    AppConfirmService,
    LearnerNavigation,
    ApplicationService,
    DocumentsService
  ],
  exports: [
    MatCardModule,
    MatButtonModule
  ]
})
export class LocalJobsModule { }
