import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

import { EmailManagementRoutingModule } from './email-management-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CampaignManagementComponent } from './campaign-management/campaign-management.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { ProcessManagementComponent } from './process-management/process-management.component';
import { CreateProcessComponent } from './create-process/create-process.component';
import { ViewCampaignComponent } from './view-campaign/view-campaign.component';
import { TemplateComponent } from './template/template.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ViewTemplateComponent } from './view-template/view-template.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CountallContactComponent } from './countall-contact/countall-contact.component';
import { OrderModule } from 'ngx-order-pipe';
import { UnsubscribeEmailComponent } from './unsubscribe-email/unsubscribe-email.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

//NGX



@NgModule({
  declarations: [DashboardComponent, CampaignManagementComponent, CreateCampaignComponent, ProcessManagementComponent, CreateProcessComponent, ViewCampaignComponent, TemplateComponent, CreateTemplateComponent, ViewTemplateComponent, ConfigurationComponent, CountallContactComponent, UnsubscribeEmailComponent],
  imports: [
    CommonModule,
    EmailManagementRoutingModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FormsModule , 
    ReactiveFormsModule,
    EditorModule,
    NgMultiSelectDropDownModule,
    OrderModule
  ]
})
export class EmailManagementModule { }
