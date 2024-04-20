import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCaptrLearnerRoutingModule } from './add-captr-learner-routing.module';
import { FurtherInformationComponent } from './further-information/further-information.component';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppConfirmModule } from 'src/app/framework/components/app-confirm/app-confirm.module';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    FurtherInformationComponent
  ],
  imports: [
    CommonModule,
    AddCaptrLearnerRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    AppConfirmModule,
    SharedModule,
    MatRadioModule,
  ]
})
export class AddCaptrLearnerModule { }
