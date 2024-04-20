import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageTitleIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { AuthorizationGuard } from '../../framework/guards/authorization.guard';
import { CustomersComponent } from './customers.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';


const routes: Routes = [

  {
    path: '',
    component: CustomersComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Title for customers', auth: [49]}
  },
  {
    path: 'new',
    component: EditCustomerComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Add customer', auth: [49,1], identifier:PageTitleIdentifier.ADD_CUSTOMER}
  },
  {
    path: 'view/:id',
    component: ViewCustomerComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'View customer', auth: [49], identifier:PageTitleIdentifier.VIEW_CUSTOMER}
  },
  {
    path: 'edit/:id',
    component: EditCustomerComponent,
    canActivate: [AuthorizationGuard],
    data: { title: 'Edit customer', auth: [49,3], identifier:PageTitleIdentifier.EDIT_CUSTOMER}
  },
  {
    path: 'content-sync-data', loadChildren: () => import('./sync-data/sync-data.module').then(m => m.SyncDataModule),
    data: { title: 'Content Sync Data', breadcrumb: '', preload: false, auth: [12], identifier:PageTitleIdentifier.Content_Sync_Data },
  },
  {
    path: 'track-lite-sync-data', loadChildren: () => import('./track-lite-sync-data/track-lite-sync-data.module').then(m => m.TrackLiteSyncDataModule),
    data: { title: 'Track Lite Sync Data', breadcrumb: '', preload: false, auth: [12], identifier:PageTitleIdentifier.Track_Lite_Sync_Data},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
