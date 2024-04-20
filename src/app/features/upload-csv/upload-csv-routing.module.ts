import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UploadCsvComponent } from './upload-csv.component';

const routes: Routes = [
  {
    path: '',
    component: UploadCsvComponent,
    data: { title : 'Upload' },
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadCsvRoutingModule { }
