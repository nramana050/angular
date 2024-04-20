import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewParticipantRoutingModule } from './view-participant-routing.module';
import { ReferralV2Component } from './referral-v2/referral-v2.component';
import { AddEditReferralComponent } from './referral-v2/add-edit-referral/add-edit-referral.component';
import { AddEditReferralV2Component } from './referral-v2/add-edit-referral-v2/add-edit-referral-v2.component';
import { ViewReferralV2Component } from './referral-v2/view-referral-v2/view-referral-v2.component';


@NgModule({
  declarations: [
    ReferralV2Component,
    AddEditReferralComponent,
    AddEditReferralV2Component,
    ViewReferralV2Component
  ],
  imports: [
    CommonModule,
    ViewParticipantRoutingModule
  ]
})
export class ViewParticipantModule { }
