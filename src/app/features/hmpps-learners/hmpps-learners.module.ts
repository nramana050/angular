import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HmppsLearnersRoutingModule } from './hmpps-learners-routing.module';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfirmModule } from 'src/app/framework/components/app-confirm/app-confirm.module';
import { FeatureAllowModule } from '../shared/components/directives/features-allow.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { FileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { AddCaptrLearnerModule } from '../captr-learners/add-captr-learner/add-captr-learner.module';
import { ConfirmBoxModule } from '../shared/components/confirm-box/confirm-box.module';
import { FormControlModule } from '../shared/components/form-control/form-control.module';
import { MatSelectSearchModule } from '../shared/components/mat-select-search/mat-select-search.module';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { HmppsLearnersComponent } from './hmpps-learners.component';
import { AddHmppsLearnerComponent } from './add-hmpps-learner/add-hmpps-learner.component';



@NgModule({
  declarations: [HmppsLearnersComponent, AddHmppsLearnerComponent],
  imports: [
    CommonModule,
    HmppsLearnersRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    AppConfirmModule,
    FeatureAllowModule,
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

  ]
})
export class HmppsLearnersModule { }
