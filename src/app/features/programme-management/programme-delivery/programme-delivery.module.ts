import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressCompletionComponent } from './progress-completion/progress-completion.component';
import { AddProgrammeDeliveryComponent } from './add-programme-delivery/add-programme-delivery.component';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WithdrawalsComponent } from './withdrawals/withdrawals.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ViewProgressCompletionComponent } from './progress-completion/view-progress-completion/view-progress-completion.component';
import { ProgrammeDeatailsComponent } from './progress-completion/view-progress-completion/programme-deatails/programme-deatails.component';
import { ProgressCompletionsComponent } from './progress-completion/view-progress-completion/progress-completions/progress-completions.component';



@NgModule({
  declarations: [
    ProgressCompletionComponent,
    AddProgrammeDeliveryComponent,
    WithdrawalsComponent,
    ViewProgressCompletionComponent,
    ProgrammeDeatailsComponent,
    ProgressCompletionsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatExpansionModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ProgrammeDeliveryModule { }
