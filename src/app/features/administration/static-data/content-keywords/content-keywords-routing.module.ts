import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentKeywordsComponent } from './content-keywords.component';
import { AuthenticationGuard } from '../../../../framework/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../framework/guards/authorization.guard';
import { EditKeywordComponent } from './edit-keyword/edit-keyword.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

const routes: Routes = [
  { path: '',
    component: ContentKeywordsComponent,
    data: { title: 'Manage Resource Keywords', auth: [15] },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  },
  {
    path: 'add-keyword',
    component: EditKeywordComponent,
    data: { title: 'Add Resource Keywords', auth: [15], identifier:PageTitleIdentifier.Add_Resource_Keywords },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentKeywordsRoutingModule { }
