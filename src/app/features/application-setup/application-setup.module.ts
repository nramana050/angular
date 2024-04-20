import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfirmModule } from 'src/app/framework/components/app-confirm/app-confirm.module';
import { MaterialModule } from 'src/app/framework/material/material.module';
import { SharedModule } from 'src/app/framework/shared/shared.module';
import { ApplicationSetupRoutingModule } from './application-setup-routing.module';
import { ApplicationSetupComponent } from './application-setup.component';
import { ApplicationSetupNavigation } from './application-setup-nav';
import { LinksComponent } from './useful-link/links/links.component';
import { TabsComponent } from './useful-link/tabs/tabs.component';
import { RoleCreationComponent } from './role-creation/role-creation.component';
import { AddTabsComponent } from './useful-link/tabs/add-tabs/add-tabs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipeModule } from 'src/app/framework/pipes/filter.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { FeatureAllowModule } from '../shared/components/directives/features-allow.module';
import { ConfirmBoxModule } from '../shared/components/confirm-box/confirm-box.module';
import { FormControlModule } from '../shared/components/form-control/form-control.module';
import { MatSortModule } from '@angular/material/sort';
import { ViewTabsComponent } from './useful-link/tabs/view-tabs/view-tabs.component';
import { AddLinksComponent } from './useful-link/links/add-links/add-links.component';
import { AddRolesComponent } from './role-creation/add-roles/add-roles.component';
import { AddRoleSteps } from './role-creation/add-roles.steps';
import { RbacPermissionsComponent } from './role-creation/rbac-permissions/rbac-permissions.component';
import { RoleConfigurationComponent } from './role-creation/role-configuration/role-configuration.component';
import { OverviewComponent } from './role-creation/overview/overview.component';
import { ViewRoleComponent } from './role-creation/view-role/view-role.component';
import { SessionsService } from '../shared/services/sessions.service';
import { LicencesComponent } from './licences/licences.component';
import { ProgrammeSetupComponent } from './programme-setup/programme-setup.component';
import { AddEditProgrammeSetupComponent } from './programme-setup/add-edit-programme-setup/add-edit-programme-setup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [ApplicationSetupComponent, TabsComponent, LinksComponent, RoleCreationComponent, AddTabsComponent, ViewTabsComponent, AddRolesComponent, RbacPermissionsComponent, RoleConfigurationComponent, OverviewComponent,AddLinksComponent, ViewRoleComponent,LicencesComponent, ProgrammeSetupComponent, AddEditProgrammeSetupComponent],
  imports: [
    CommonModule,
    ApplicationSetupRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppConfirmModule,
    FeatureAllowModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatRadioModule,
    ConfirmBoxModule,
    FormControlModule,
    FilterPipeModule,
    MatSortModule,
    FilterPipeModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    CKEditorModule
  ],
  providers: [ApplicationSetupNavigation, AddRoleSteps, SessionsService]
})
export class ApplicationSetupModule { }
