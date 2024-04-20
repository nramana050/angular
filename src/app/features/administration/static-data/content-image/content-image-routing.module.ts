import { AuthorizationGuard } from './../../../../framework/guards/authorization.guard';
import { AuthenticationGuard } from './../../../../framework/guards/authentication.guard';
import { ContentImageComponent } from './content-image.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditContentImageComponent } from './edit-content-image/edit-content-image.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

const routes: Routes = [
  {
    path: '',
    component: ContentImageComponent,
    data: { title: 'Manage Resource Images', auth: [15] },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  },
  {
    path: 'edit-content-image',
    component: EditContentImageComponent,
    data: { title: 'Add Image', auth: [15], identifier:PageTitleIdentifier.Add_Image },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  },
  {
    path: 'edit/:id',
    component: EditContentImageComponent,
    data: { title: 'Edit Image Keywords', auth: [15], identifier:PageTitleIdentifier.Edit_Image_Keywords },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentImageRoutingModule { }
