import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { OfjobsExpressionOfInterestRoutingModule } from './ofjobs-expression-of-interest-routing.module';
import { OFJobsExpressionOfInterestComponent } from './ofjobs-expression-of-interest.component';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { LocalJobsService } from '../local-jobs/local-jobs.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { LearnerNavigation } from '../../captr-learners/view-captr-learner/learner-nav';
import { ApplicationService } from '../../application/application.service';
import { DocumentsService } from '../../captr-learners/view-captr-learner/documents/documents.service';
import { ViewOFJobsExpressionOfInterestComponent } from '../local-jobs/view-ofjobs-expression-of-interest/view-ofjobs-expression-of-interest.component';
import { SessionsService } from '../../shared/services/sessions.service';

@NgModule({
  declarations: [OFJobsExpressionOfInterestComponent, ViewOFJobsExpressionOfInterestComponent],
  imports: [
    CommonModule,
    OfjobsExpressionOfInterestRoutingModule,
    MaterialModule,
    FormsModule,
    FilterPipeModule,
    ReactiveFormsModule
    
  ],
  providers:[LocalJobsService,
    SnackBarService,
    AppConfirmService,
    LearnerNavigation,
    ApplicationService,
    DocumentsService,
    SessionsService
  ],
  exports: [
    MatCardModule,
    MatButtonModule,
    FilterPipeModule
  ]
})
export class OfjobsExpressionOfInterestModule { }
