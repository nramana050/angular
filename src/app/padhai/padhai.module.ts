import { NgModule } from '@angular/core';
import { ContentGeneratorComponent } from './content-generator/content-generator.component';
import { padhaiRoutingModule } from './padhai-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/helper/material/material.module';
import { AddContentCourseComponent } from './add-course/add-content-course.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EditContentComponent } from './edit-content/edit-content.component';
import { NewPreviewComponent } from './edit-content/new-preview/new-preview.component';
import { LearningOutcomesComponent } from './learning-outcomes/learning-outcomes.component';
import { PreviewCourseComponent } from './preview-course/preview-course.component';
import { TranslatePopupComponent } from './translate-popup/translate-popup.component';
import { FilterPipeModule } from '../helper/pipes/filter.module';
import { FeatureAllowModule } from '../helper/directives/features-allow.module';

@NgModule({
  declarations: [
    ContentGeneratorComponent,
    AddContentCourseComponent,
    EditContentComponent,
    PreviewCourseComponent,
    NewPreviewComponent,
    TranslatePopupComponent,
    LearningOutcomesComponent
  ],
  
  imports: [ 
    CommonModule,
    padhaiRoutingModule,
    MatCardModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule, 
    FilterPipeModule,
    CKEditorModule,
    FeatureAllowModule
   
   ],
})
export class padhaiModule { }