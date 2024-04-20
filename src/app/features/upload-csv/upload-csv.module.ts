import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCsvComponent } from './upload-csv.component';
import { OpencsverrorpopupComponent } from './opencsverrorpopup/opencsverrorpopup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { FeatureAllowModule } from '../shared/components/directives/features-allow.module';
import { UploadCsvRoutingModule } from './upload-csv-routing.module';
import { UploadCsvService } from './upload-csv.service';



@NgModule({
  declarations: [UploadCsvComponent, OpencsverrorpopupComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FeatureAllowModule,
    UploadCsvRoutingModule,
    ReactiveFormsModule 
],
providers: [
    UploadCsvService
]
})
export class UploadCsvModule { }
