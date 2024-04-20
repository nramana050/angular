import { Routes } from '@angular/router';
import { SessionsComponent } from './sessions.component';
import { SigninComponent } from './signin/signin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangeExpiredPasswordComponent } from './change-expired-password/change-expired-password.component';
import { from } from 'rxjs';
import { OktaCallbackComponent } from '@okta/okta-angular';

export const SessionsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SessionsComponent,
    children: [
      {
        path: 'signin',
        component: SigninComponent,
      }, {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { title: 'Forgot Password' }
      }, {
        path: 'set-password',
        component: ResetPasswordComponent,
      }, {
        path: 'change-expired-password',
        component: ChangeExpiredPasswordComponent,
      },
      { path: 'login/callback', component: OktaCallbackComponent }
    ]
  }
];
