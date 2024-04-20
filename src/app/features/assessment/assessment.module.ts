import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssessmentComponent } from './assessment.component';
import { AssessmentRoutingModule } from './assessment.routing';
import { AssessmentService } from './assessment.service';
import { AssessmentsCustomLocalisations } from './assessment.en.localisation';
import { SharedModule } from '../..//framework/shared/shared.module';
import { MaterialModule } from '../../framework/material/material.module';
import { ViewAssessmentComponent } from './view-assessment/view-assessment.component';
import { EditAssessmentComponent } from './edit-assessment/edit-assessment.component';
import { PublishAssessmentComponent } from './publish-assessment/publish-assessment.component';
import { PaginationService } from './publish-assessment/publish-assessment.pagination';
import { AssessmentDashboardComponent } from './assessment-dashboard/assessment-dashboard.component';
import { SurveyModule } from 'survey-angular-ui';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AssessmentRoutingModule,
    SurveyCreatorModule,
    SurveyModule,
    FilterPipeModule
  ],
  declarations: [
    AssessmentComponent,
    ViewAssessmentComponent,
    EditAssessmentComponent,
    PublishAssessmentComponent,
    AssessmentDashboardComponent
  ],
  providers: [AssessmentService,
    AssessmentsCustomLocalisations,
    PaginationService],
  entryComponents: [ ]
})
export class AssessmentModule { }
