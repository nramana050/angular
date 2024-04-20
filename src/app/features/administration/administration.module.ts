import { AdministrationNavigation } from './administration.nav';
import { ReactiveFormsModule } from '@angular/forms';
import { AdministrationComponent } from './administration.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { MaterialModule } from '../../framework/material/material.module';
import { FeatureAllowModule } from '../shared/components/directives/features-allow.module';
import { SessionsService } from '../shared/services/sessions.service';

@NgModule({
  declarations: [AdministrationComponent],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FeatureAllowModule 
  ],
  providers: [AdministrationNavigation,
    // SessionsService
  ]
})
export class AdministrationModule { }
