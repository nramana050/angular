import { NgModule } from '@angular/core';
import { RwsContentManagementComponent } from './rws-content-management.component'
import { rwsContentManagementRoutingModule } from '../rws-content-management/rws-content-management-Routing.Module'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { EditRwsContentManagementComponent } from './edit-rws-content-management/edit-rws-content-management.component';
import { ContentManagementSteps } from '../content-management/content.steps';
import { ViewContentComponent } from './view-content/view-content.component';
import { StepperNavigationModule } from '../shared/components/stepper-navigation/stepper-navigation.module';
import { StepperNavigationService } from '../shared/components/stepper-navigation/stepper-navigation.service';
import { ContentManagementModule } from '../content-management/content-management.module';

@NgModule({
    declarations: [RwsContentManagementComponent, EditRwsContentManagementComponent,  ViewContentComponent],
    imports: [ rwsContentManagementRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        FormsModule,
        FilterPipeModule,
        StepperNavigationModule,
        ContentManagementModule
      ],
        providers:[
          ContentManagementSteps,
          StepperNavigationService,
          ContentManagementSteps
        ]
  })
export class RwsContentManagementModule { }
