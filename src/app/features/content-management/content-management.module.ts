import { AppConfirmModule } from './../../framework/components/app-confirm/app-confirm.module';
import { ContentManagementService } from './content-management.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ContentManagementRoutingModule } from './content-management-routing.module';
import { ContentManagementComponent } from './content-management.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepperNavigationModule } from '../../features/shared/components/stepper-navigation/stepper-navigation.module';
import { StepperNavigationService } from '../../features/shared/components/stepper-navigation/stepper-navigation.service';
import { ContentManagementSteps } from './content.steps';
import { MaterialModule } from '../../framework/material/material.module';
import { FeatureAllowModule } from '../shared/components/directives/features-allow.module';
import { FileUploadModule } from '../shared/components/file-upload/file-upload.module';
import { ViewContentComponent } from './view-content/view-content.component';
import { EditContentComponent } from './edit-content/edit-content.component';
import { EditContentImageComponent } from './edit-content-image/edit-content-image.component';
import { EditContentKeywordsComponent } from './edit-content-keywords/edit-content-keywords.component';
import { ContentUploadComponent } from './content-upload/content-upload.component';
import { InternalContentComponent } from './content-upload/internal-content/internal-content.component';
import { EditContentModuleComponent } from './edit-content-module/edit-content-module.component';
import { EditContentEstablishmentComponent } from './edit-content-establishment/edit-content-establishment.component';
import { OrgSearchFilterModule } from '../shared/components/org-search-filter/org-search-filter.module';
import { ExternalContentComponent } from './content-upload/external-content/external-content.component';
import { UploadExternalContentComponent } from './content-upload/upload-external-content/upload-external-content.component';
import { ContentModuleComponent } from './content-module/content-module.component';
import { VideoPlayerModule } from '../shared/components/video-player/video-player.module';
import { DocViewerModule } from '../shared/components/doc-viewer/doc-viewer.module';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { ImageViewModule } from '../shared/components/image-viewer/image-viewer.module';


@NgModule({
  declarations: [
    ContentManagementComponent,
    ViewContentComponent,
    EditContentComponent,
    EditContentImageComponent,
    EditContentKeywordsComponent,
    ContentUploadComponent,
    InternalContentComponent,
    EditContentModuleComponent,
    EditContentEstablishmentComponent,
    ExternalContentComponent,
    UploadExternalContentComponent,
    ContentModuleComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContentManagementRoutingModule,
    MaterialModule,
    FeatureAllowModule,
    StepperNavigationModule,
    FeatureAllowModule,
    FileUploadModule,
    DragDropModule,
    AppConfirmModule,
    DocViewerModule,
    VideoPlayerModule,
    OrgSearchFilterModule,
    FilterPipeModule,
    ImageViewModule,
    FilterPipeModule
  ],
  providers: [
    ContentManagementService,
    StepperNavigationService,
    ContentManagementSteps
  ],
  exports:[ContentModuleComponent]
})
export class ContentManagementModule { }
