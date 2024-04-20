import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';
import { ReportingService } from './reporting.service';
import { MaterialModule } from '../../framework/material/material.module';
import { ReportsNavigation } from './reporting.nav';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { NgxPowerBiModule } from 'ngx-powerbi';
import { ReportsModule } from './reports/reports.module';
import { SessionsService } from '../shared/services/sessions.service';


@NgModule({
  declarations: [ReportingComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReportingRoutingModule,
    PowerBIEmbedModule,
    NgxPowerBiModule,
    ReportsModule
  ],
  providers: [ReportingService, ReportsNavigation, SessionsService]
})
export class ReportingModule { }
