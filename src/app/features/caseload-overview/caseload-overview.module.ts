import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfirmModule } from 'src/app/framework/components/app-confirm/app-confirm.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { ConfirmBoxModule } from '../shared/components/confirm-box/confirm-box.module';
import { FormControlModule } from '../shared/components/form-control/form-control.module';
import { MatSelectSearchModule } from '../shared/components/mat-select-search/mat-select-search.module';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { SurveyModule } from 'survey-angular-ui';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CaseloadOverviewRoutingModule } from './caseload-overview-routing.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CaptrLearnersModule } from '../captr-learners/captr-learners.module';
import { CaseloadOverviewComponent } from './caseload-overview.component';
import { MyToDoModule } from '../participant-v2/my-to-do/my-to-do.module';

@NgModule({
  declarations: [
    CaseloadOverviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CaseloadOverviewRoutingModule,
    ReactiveFormsModule,
    AppConfirmModule,
    MatTabsModule,
    MatButtonToggleModule,
    SharedModule,
    MatRadioModule,
    FileUploadModule,
    ConfirmBoxModule,
    FormControlModule,
    MatSelectSearchModule,
    FormsModule,
    FilterPipeModule,
    SurveyModule,
    NgApexchartsModule,
    MatSlideToggleModule,
    CaptrLearnersModule,
    MyToDoModule
  ]
})
export class CaseloadOverviewModule { }
