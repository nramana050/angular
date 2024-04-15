import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountManagementRoutingModule } from './account-management-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentProcessComponent } from './payment-process/payment-process.component';
import { PlanDetailComponent } from './plan-detail/plan-detail.component';
import { DowngradePlanComponent } from './downgrade-plan/downgrade-plan.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivityComponent } from './activity/activity.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
  declarations: [OverviewComponent, PaymentHistoryComponent, PaymentProcessComponent, PlanDetailComponent, DowngradePlanComponent, ActivityComponent],
  imports: [
    CommonModule,
    AccountManagementRoutingModule,
    FormsModule, ReactiveFormsModule,
    NgxPaginationModule,
    NgCircleProgressModule,
    OrderModule
  ]
})
export class AccountManagementModule { }
