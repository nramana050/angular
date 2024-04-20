import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrisonJobsRoutingModule } from './prison-jobs-routing.module';
import { PrisonJobsComponent } from './prison-jobs.component';
import { EditPrisonJobsComponent } from './edit-prison-jobs/edit-prison-jobs.component';
import { PrisonJobsService } from './prison-jobs.service';
import { PaginationService } from '../../assessment/publish-assessment/publish-assessment.pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewPrisonJobsComponent } from './view-prison-jobs/view-prison-jobs.component';
import { MaterialModule } from '../../../framework/material/material.module';
import { FeatureAllowModule } from '../../../framework/directives/features-allow.module';
import { FilterPipeModule } from '../../../framework/pipes/filter.module';
import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from '../../../framework/service/snack-bar.service';


@NgModule({
  declarations: [PrisonJobsComponent,
    EditPrisonJobsComponent,
    ViewPrisonJobsComponent
  ],
  imports: [
    CommonModule,
    PrisonJobsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FeatureAllowModule,
    FilterPipeModule
  ],
  exports: [
    MatCardModule,
    MatButtonModule
  ],
  providers: [PrisonJobsService,
    PaginationService,
    SnackBarService,
    AppConfirmService
  ],
  entryComponents: []
})
export class PrisonJobsModule { }
