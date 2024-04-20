import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationSetupComponent } from './application-setup.component';
import { AuthorizationGuard } from 'src/app/framework/guards/authorization.guard';
import { TabsComponent } from './useful-link/tabs/tabs.component';
import { LinksComponent } from './useful-link/links/links.component';
import { RoleCreationComponent } from './role-creation/role-creation.component';
import { ViewTabsComponent } from './useful-link/tabs/view-tabs/view-tabs.component';
import { AddLinksComponent } from './useful-link/links/add-links/add-links.component';
import { AddRolesComponent} from './role-creation/add-roles/add-roles.component';
import { RbacPermissionsComponent } from './role-creation/rbac-permissions/rbac-permissions.component';
import { RoleConfigurationComponent } from './role-creation/role-configuration/role-configuration.component';
import { OverviewComponent } from './role-creation/overview/overview.component';
import { CanDeactivateGuard } from 'src/app/framework/guards/can-deactivate/can-deactivate.guard';
import { ViewRoleComponent } from './role-creation/view-role/view-role.component';
import { LicencesComponent } from './licences/licences.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { ProgrammeSetupComponent } from './programme-setup/programme-setup.component'
import { AddEditProgrammeSetupComponent } from './programme-setup/add-edit-programme-setup/add-edit-programme-setup.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationSetupComponent,
    data: { title: 'Application Setup', identifier:PageTitleIdentifier.Application_set_up },
   
  },

  {
    path: 'tabs',
    component: TabsComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '', auth: [79] }
  },
  {
    path: 'tabs/view-tabs',
    component: ViewTabsComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '', auth: [79] }
  },
  {
    path: 'links',
    component: LinksComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '', auth: [79] }
  },
  {
    path: 'role-creation',
    component: RoleCreationComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '', auth: [79] }
  },
  {
    path: 'links/add-links',
    component: AddLinksComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Add link', auth: [79], identifier:PageTitleIdentifier.Add_link}
  },
  {
    path: 'links/edit-links/:id',
    component: AddLinksComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Edit link', auth: [79], identifier:PageTitleIdentifier.Edit_link}
  },
  {
    path: 'role-creation/add-roles',
    component: AddRolesComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { title: 'Role', auth: [79], identifier:PageTitleIdentifier.Role }
  },
  {
    path: 'role-creation/rbac-permissions',
    component: RbacPermissionsComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { title: 'RBAC Permissions', auth: [79], identifier:PageTitleIdentifier.RBAC_Permissions }
  },
  {
    path: 'role-creation/role-configuration',
    component: RoleConfigurationComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { title: 'Role Configuration', auth: [79], identifier:PageTitleIdentifier.Role_Configuration }
  },
  {
    path: 'role-creation/overview',
    component: OverviewComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { title: 'Overview', auth: [79], identifier:PageTitleIdentifier.Overview}
  },
  {
    path: 'role-creation/view-role',
    component: ViewRoleComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'View role', auth: [79], identifier:PageTitleIdentifier.View_role }
  },
  {
    path: 'licences',
    component: LicencesComponent,
    canActivate: [AuthorizationGuard],
    data: { title: '', auth: [79] }
  },
  {
    path: 'programme',
    component:ProgrammeSetupComponent,
    data: { title: '' }

  },
  {
    path: 'programme/add-edit-programme-setup',
    component: AddEditProgrammeSetupComponent,
    data: { title: 'Programme setup', auth: [79] }


  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationSetupRoutingModule { }
