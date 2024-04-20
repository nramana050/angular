import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageOrganisationsComponent } from './manage-organisations.component';
import { ManageOrganisationsRoutingModule } from './manage-organisations-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewOrganisationComponent } from './view-organisation/view-organisation.component';
import { AddEditOrganisationComponent } from './add-edit-organisation/add-edit-organisation.component';
import { ManageOrganisationsService } from './manage-organisations.service';
import { ApplicationSetupNavigation } from '../application-setup/application-setup-nav';
import { FeatureAllowModule } from 'src/app/framework/directives/features-allow.module';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageOrganisationsRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    FeatureAllowModule,
    FilterPipeModule
  ],
  declarations: [
    ManageOrganisationsComponent,
    ViewOrganisationComponent,
    AddEditOrganisationComponent,
  ],
  providers: [
    ManageOrganisationsService,
    ApplicationSetupNavigation
  ]
})
export class ManageOrganisationsModule { }
