import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentCategoryComponent } from './content-category.component';
import { AuthenticationGuard } from '../../../../framework/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../framework/guards/authorization.guard';
import { EditContentCategoryComponent } from './edit-content-category/edit-content-category.component';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

const routes: Routes = [
  { path: '',
    component: ContentCategoryComponent,
    data: { title: 'Manage Resource Categories', auth: [15] },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  },
  { path: 'new',
    component: EditContentCategoryComponent,
    data: { title: 'Add Resource Category', auth: [15, 1] ,identifier:PageTitleIdentifier.Add_Resource_Category },
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  },
  { path: 'edit/:id',
    component: EditContentCategoryComponent,
    data: { title: 'Edit Resource Category', auth: [15, 1] , identifier:PageTitleIdentifier.Edit_Resource_Category},
    canActivate: [AuthenticationGuard, AuthorizationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentCategoryRoutingModule { }
