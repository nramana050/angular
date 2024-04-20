import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './framework/guards/authentication.guard';
import { AuthorizationGuard } from './framework/guards/authorization.guard';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    // canActivate: [AuthenticationGuard],
  },
  // {
  //   path: 'sessions', loadChildren: () => import('./sessions/sessions.module').then(m => m.SessionsModule),
  // },
  // {
  //   path: '**',
  //   redirectTo: 'sessions/404',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
