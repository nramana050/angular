import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CampaignManagementComponent } from './campaign-management/campaign-management.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { ProcessManagementComponent } from './process-management/process-management.component';
import { CreateProcessComponent } from './create-process/create-process.component';
import { ViewCampaignComponent } from './view-campaign/view-campaign.component';
import { TemplateComponent } from './template/template.component';
import { ViewTemplateComponent } from './view-template/view-template.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { from } from 'rxjs';
import { CountallContactComponent } from './countall-contact/countall-contact.component';
import { UnsubscribeEmailComponent } from './unsubscribe-email/unsubscribe-email.component';
import { AuthGuard } from '../helper/auth.guard';

const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent },
    {path: 'campaign-management', component: CampaignManagementComponent },
    {path: 'create-campaign', component: CreateCampaignComponent },
    {path: 'process-management', component: ProcessManagementComponent },
    {path: 'create-process', component: CreateProcessComponent },
    {path: 'view-campaign', component: ViewCampaignComponent },
    {path: 'template', component: TemplateComponent },
    {path: 'view-template', component: ViewTemplateComponent },
    {path: 'configuration', component: ConfigurationComponent },
    {path: 'create-template', component: CreateTemplateComponent },
    {path: 'countall-contacts', component: CountallContactComponent },
    {path: 'unsubscribe', component: UnsubscribeEmailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailManagementRoutingModule { }
