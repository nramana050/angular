import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DatePipe  } from '@angular/common'
//Modules
import { CommonFilesModule } from './common-files/common-files.module';
import { EmailManagementModule } from './email-management/email-management.module';
import { ProfileManagementModule } from './profile-management/profile-management.module';
import { ContactManagementModule } from './contact-management/contact-management.module';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AccountManagementModule } from './account-management/account-management.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ErrorInterceptor } from './helper/error.interceptor';
import { RefreshTokenInterceptor } from './helper/token-interceptor.service';
import { AuthGuard } from './helper/auth.guard';
// import { TokenInterceptorInterceptor } from './Interceptor/token-interceptor.interceptor';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule ,
    AppRoutingModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    CommonFilesModule,
    EmailManagementModule,
    ProfileManagementModule,
    AuthModule,
    ContactManagementModule,
    EditorModule,
    NgMultiSelectDropDownModule.forRoot(),
    AccountManagementModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "green",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true } ,
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
