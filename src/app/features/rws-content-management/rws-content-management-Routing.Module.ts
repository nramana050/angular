import { NgModule } from "@angular/core";
import { RwsContentManagementComponent } from "./rws-content-management.component";
import { RouterModule, Routes } from "@angular/router";
import { EditRwsContentManagementComponent } from "./edit-rws-content-management/edit-rws-content-management.component";
import { PageTitleIdentifier } from '../../framework/constants/PageTitleIdentifier-constants'
import { ContentUploadComponent } from "../content-management/content-upload/content-upload.component";
import { EditContentEstablishmentComponent } from "../content-management/edit-content-establishment/edit-content-establishment.component";
import { InternalContentComponent } from "../content-management/content-upload/internal-content/internal-content.component";
import { UploadExternalContentComponent } from "../content-management/content-upload/upload-external-content/upload-external-content.component";
import { ExternalContentComponent } from "../content-management/content-upload/external-content/external-content.component";
import { ViewContentComponent } from "./view-content/view-content.component";
import { EditContentKeywordsComponent } from "../content-management/edit-content-keywords/edit-content-keywords.component";
import { EditContentImageComponent } from "../content-management/edit-content-image/edit-content-image.component";
import { EditContentModuleComponent } from "../content-management/edit-content-module/edit-content-module.component";

const caseNote = 'case-note';
const routes: Routes = [
    {
      path: '',
      component: RwsContentManagementComponent,
      // canActivate: [],
      data: { title: ''},
    }, {
      path: 'content',
      component: EditRwsContentManagementComponent,
      data: { title: 'Resource Description', identifier:PageTitleIdentifier.Resource_Description},
      // canActivate: [AuthenticationGuard, AuthorizationGuard],
    },
    {
      path: 'establishment',
      component: EditContentEstablishmentComponent,
      data: { title: 'Resource Programmes', identifier:PageTitleIdentifier.Resource_Teams},
      // canActivate: [AuthenticationGuard, AuthorizationGuard],
    },
    {
      path: 'category',
      component: EditContentKeywordsComponent,
      data: { title: 'Resource Category', identifier:PageTitleIdentifier.Resource_Keywords},
      // canActivate: [AuthenticationGuard, AuthorizationGuard],
    },
    {
      path: 'image',
      component: EditContentImageComponent,
      data: { title: 'Resource Image',  identifier:PageTitleIdentifier.Resource_Image},
      // canActivate: [AuthenticationGuard, AuthorizationGuard],
    },
    {
      path: 'upload/internal/module',
      component: EditContentModuleComponent,
      data: { title: 'Resource Module', identifier:PageTitleIdentifier.Resource_Module},
      // canActivate: [AuthenticationGuard, AuthorizationGuard],
    }, 
    {
      path: 'view-contents',
      component: ViewContentComponent,
      data: { title: 'Resource View', identifier:PageTitleIdentifier.Resource_Details},
      // canActivate: [AuthenticationGuard, AuthorizationGuard],
    },
    {
      path: 'upload',
      component: ContentUploadComponent,
      data: { title: 'Resource Upload',  identifier:PageTitleIdentifier.Resource_Upload},
      // canActivate: [AuthenticationGuard, AuthorizationGuard],
    },

    {
      path: 'upload/internal',
      component: InternalContentComponent,
      data: {title: 'Internal Resource'},
      // canActivate: [AuthenticationGuard, AuthorizationGuard],
      },
      {
        path: 'upload/external',
        component: UploadExternalContentComponent,
        data: {title: 'External Resource'},
        // canActivate: [AuthenticationGuard, AuthorizationGuard],
      },
      {
        path: 'upload/external/view',
        component: ExternalContentComponent,
        data: {title: 'External Resource'},
        // canActivate: [AuthenticationGuard, AuthorizationGuard],
      }
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class rwsContentManagementRoutingModule { }