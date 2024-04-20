import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppConfirmService } from '../../../../framework/components/app-confirm/app-confirm.service';
import { AppConfirmModule } from '../../../../framework/components/app-confirm/app-confirm.module';
import { ContentKeywordsRoutingModule } from './content-keywords-routing.module';
import { ContentKeywordsComponent } from './content-keywords.component';
import { EditKeywordComponent } from './edit-keyword/edit-keyword.component';
import { MaterialModule } from '../../../../framework/material/material.module';
import { FeatureAllowModule } from 'src/app/features/shared/components/directives/features-allow.module';

@NgModule({
  declarations: [ContentKeywordsComponent, EditKeywordComponent],
  imports: [
    CommonModule,
    ContentKeywordsRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    AppConfirmModule,
    FeatureAllowModule
  ],
  providers: [AppConfirmService]
})
export class ContentKeywordsModule { }
