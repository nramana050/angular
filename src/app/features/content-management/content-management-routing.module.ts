import { ContentManagementComponent } from './content-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from '../../framework/guards/authorization.guard';
import { AuthenticationGuard } from '../../framework/guards/authentication.guard';
import { ViewContentComponent } from './view-content/view-content.component';
import { EditContentComponent } from './edit-content/edit-content.component';
import { EditContentImageComponent } from './edit-content-image/edit-content-image.component';
import { EditContentKeywordsComponent } from './edit-content-keywords/edit-content-keywords.component';
import { ContentUploadComponent } from './content-upload/content-upload.component';
import { InternalContentComponent } from './content-upload/internal-content/internal-content.component';
import { EditContentModuleComponent } from './edit-content-module/edit-content-module.component';
import { EditContentEstablishmentComponent } from './edit-content-establishment/edit-content-establishment.component';
import { UploadExternalContentComponent } from './content-upload/upload-external-content/upload-external-content.component';
import { ExternalContentComponent } from './content-upload/external-content/external-content.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';


const routes: Routes = [
  {
    path: '',
    component: ContentManagementComponent,
    data: { title: 'Manage Resource', auth:[13]},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'content',
    component: EditContentComponent,
    data: { title: 'Resource Description', auth:[13], identifier:PageTitleIdentifier.Resource_Description},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'establishment',
    component: EditContentEstablishmentComponent,
    data: { title: 'Resource Teams', auth:[13], identifier:PageTitleIdentifier.Resource_Teams},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'category',
    component: EditContentKeywordsComponent,
    data: { title: 'Resource Category', auth:[13], identifier:PageTitleIdentifier.Resource_Keywords},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'image',
    component: EditContentImageComponent,
    data: { title: 'Resource Image', auth:[13], identifier:PageTitleIdentifier.Resource_Image},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'upload',
    component: ContentUploadComponent,
    data: { title: 'Resource Upload', auth:[13],  identifier:PageTitleIdentifier.Resource_Upload},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'upload/internal/module',
    component: EditContentModuleComponent,
    data: { title: 'Resource Module', auth:[13],  identifier:PageTitleIdentifier.Resource_Module},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'view-contents',
    component: ViewContentComponent,
    data: { title: 'Resource View', auth:[13], identifier:PageTitleIdentifier.Resource_Details},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'upload/internal',
    component: InternalContentComponent,
    data: {title: 'Internal Resource', auth: [13],  identifier:PageTitleIdentifier.Resource_Upload},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
  path: 'upload/internal',
  component: InternalContentComponent,
  data: {title: 'Internal Resource', auth: [13]},
  canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'upload/external',
    component: UploadExternalContentComponent,
    data: {title: 'External Resource', auth: [13]},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'upload/external/view',
    component: ExternalContentComponent,
    data: {title: 'External Resource', auth: [13]},
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentManagementRoutingModule { }
