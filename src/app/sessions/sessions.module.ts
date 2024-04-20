import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SessionsComponent } from './sessions.component';
import { MaterialModule } from '../framework/material/material.module';
import { SessionsRoutes } from './sessions.routing';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SigninComponent } from './signin/signin.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SessionsService } from './sessions.service';
import { SharedModule } from '../framework/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FilterPipeModule } from '../framework/pipes/filter.module';
import { ChangeExpiredPasswordComponent } from './change-expired-password/change-expired-password.component';
import { AppService } from '../features/shared/services/app.service';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    FilterPipeModule,
    NgHttpLoaderModule.forRoot(),
    RouterModule.forChild(SessionsRoutes)
  ],
  declarations: [SessionsComponent, SigninComponent, ResetPasswordComponent, ForgotPasswordComponent,ChangeExpiredPasswordComponent],
  providers: [SessionsService,AppService]
})
export class SessionsModule { }
