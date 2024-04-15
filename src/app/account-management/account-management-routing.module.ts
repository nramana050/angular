import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityComponent } from './activity/activity.component';
import { DowngradePlanComponent } from './downgrade-plan/downgrade-plan.component';
import { OverviewComponent } from './overview/overview.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentProcessComponent } from './payment-process/payment-process.component';
import { PlanDetailComponent } from './plan-detail/plan-detail.component';


const routes: Routes = [
  {path:'overview',component: OverviewComponent },
  {path:'payment-history',component: PaymentHistoryComponent },
  {path:'pay',component: PaymentProcessComponent },
  {path:'plan',component: PlanDetailComponent},
  {path:'downgrade' ,component: DowngradePlanComponent},
  {path: 'activity' , component:ActivityComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagementRoutingModule { }