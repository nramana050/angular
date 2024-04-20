import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgrammeManagementRoutingModule } from './programme-management-routing.module';
import { ProgrammesComponent } from './programmes/programmes.component';
import { ProgrammeDeliveryComponent } from './programme-delivery/programme-delivery.component';
import { ProgrammeManagmentNavigation } from './programme-management-nav';
import { MaterialModule } from '../../framework/material/material.module';
import { AddProgrammeComponent } from './programmes/add-programme/add-programme.component';
import { SharedModule } from '../../framework/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddProgrammeDeliveryComponent } from './programme-delivery/add-programme-delivery/add-programme-delivery.component';
import { ProgrammeDeliveryNavigation } from './programme-delivery/programme-delivery-nav';
import { ProgressCompletionComponent } from './programme-delivery/progress-completion/progress-completion.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WithdrawalsComponent } from './programme-delivery/withdrawals/withdrawals.component';
import { ViewProgrammeDeliveryComponent } from './programme-delivery/view-programme-delivery/view-programme-delivery.component';
import { ViewProgrammeDeliveryNavigation } from './programme-delivery/view-programme-delivery/view-programme-delivery-nav';
import { ViewProgrammeComponent } from './programmes/view-programme/view-programme.component';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { ViewProgressCompletionComponent } from './programme-delivery/progress-completion/view-progress-completion/view-progress-completion.component';
import { ViewProgressCompletionSteps } from './programme-delivery/progress-completion/view-progress-completion/view-progress-completion-steps';
import { ProgrammeDeatailsComponent } from './programme-delivery/progress-completion/view-progress-completion/programme-deatails/programme-deatails.component';
import { ProgressCompletionsComponent } from './programme-delivery/progress-completion/view-progress-completion/progress-completions/progress-completions.component';


@NgModule({
  declarations: [
    ProgrammesComponent,
    ProgrammeDeliveryComponent,
    AddProgrammeComponent,
    AddProgrammeDeliveryComponent,
    ProgressCompletionComponent,
    WithdrawalsComponent,
    ViewProgrammeDeliveryComponent,
    ViewProgrammeComponent,
    ViewProgressCompletionComponent,
    ProgrammeDeatailsComponent,
    ProgressCompletionsComponent
  ],
  imports: [
    ProgrammeManagementRoutingModule,
    CommonModule,
    MaterialModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    FilterPipeModule
  ],
  providers: 
  [
    ProgrammeManagmentNavigation,
    ProgrammeDeliveryNavigation, 
    ViewProgrammeDeliveryNavigation,
    ViewProgressCompletionSteps
  ]
})
export class ProgrammeManagementModule { }
