import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from '../../framework/guards/authorization.guard';
import { AuthenticationGuard } from '../../framework/guards/authentication.guard';
import { CaseloadOverviewComponent } from './caseload-overview.component';


const routes: Routes = [
  {
    path: '',
    component: CaseloadOverviewComponent,
    data: { title: 'Caseload Overview Component', auth:[111]},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
 
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseloadOverviewRoutingModule { }
