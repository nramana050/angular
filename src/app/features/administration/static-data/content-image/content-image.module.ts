import { FileUploadModule } from './../../../shared/components/file-upload/file-upload.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ContentImageComponent } from './content-image.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentImageRoutingModule } from './content-image-routing.module';
import { EditContentImageComponent } from './edit-content-image/edit-content-image.component';
import { ImageModalComponent } from './content-image.component';
import { MaterialModule } from '../../../../framework/material/material.module';
import { FeatureAllowModule } from 'src/app/features/shared/components/directives/features-allow.module';

@NgModule({
  declarations: [ContentImageComponent, EditContentImageComponent, ImageModalComponent],
  imports: [
    CommonModule,
    ContentImageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    MaterialModule,
    FeatureAllowModule
  
  ],
  entryComponents: [
    ImageModalComponent
  ]
})
export class ContentImageModule { }
