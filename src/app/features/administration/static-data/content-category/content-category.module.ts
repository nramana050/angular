import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppConfirmService } from '../../../../framework/components/app-confirm/app-confirm.service';
import { AppConfirmModule } from '../../../../framework/components/app-confirm/app-confirm.module';
import { ContentCategoryComponent } from './content-category.component';
import { EditContentCategoryComponent } from './edit-content-category/edit-content-category.component';
import { FilterModule } from '../../../shared/components/filter/filter.module';
import { MaterialModule } from '../../../../framework/material/material.module';
import { ContentCategoryRoutingModule } from './content-category-routing.module';
import { FeatureAllowModule } from 'src/app/framework/directives/features-allow.module';

@NgModule({
  declarations: [ContentCategoryComponent, EditContentCategoryComponent],
  imports: [
    MaterialModule,
    AppConfirmModule,
    FilterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContentCategoryRoutingModule,
    FeatureAllowModule
  ],
  providers: [AppConfirmService]
})
export class ContentCategoryModule { }
