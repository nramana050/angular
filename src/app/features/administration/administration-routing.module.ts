import { AuthorizationGuard } from './../../framework/guards/authorization.guard';
import { AuthenticationGuard } from './../../framework/guards/authentication.guard';
import { AdministrationComponent } from './administration.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';


const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    data: { title: 'Manage Roles', auth: [10] },
    
  },
  {
    path: 'content-category', loadChildren: () => import('./static-data/content-category/content-category.module').then(m => m.ContentCategoryModule),
    data: { title: 'Resource Categories', breadcrumb: '', preload: false, auth: [15], identifier:PageTitleIdentifier.Resource_Categories },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  },
  {
    path: 'content-keywords', loadChildren: () => import('./static-data/content-keywords/content-keywords.module').then(m => m.ContentKeywordsModule),
    data: { title: 'Resource Keywords', breadcrumb: '', preload: false, auth: [15], identifier:PageTitleIdentifier.Resource_Keywords },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  },
  {
    path: 'content-image', loadChildren: () => import('./static-data/content-image/content-image.module').then(m => m.ContentImageModule),
    data: { title: 'Images', breadcrumb: '', preload: false, auth: [15], identifier:PageTitleIdentifier.Resource_Images },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  }

];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
