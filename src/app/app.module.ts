import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SessionsService } from './sessions/sessions.service';
import { HttpRequestInterceptorModule } from './framework/service/http-interceptor.service';
import { AuthenticationGuard } from './framework/guards/authentication.guard';
import { StepperNavigationModule } from './features/shared/components/stepper-navigation/stepper-navigation.module';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SharedModule } from './framework/shared/shared.module';
import { UserActivityModule } from './sessions/user-activity/user-activity.module';
import { AuthorizationGuard } from './framework/guards/authorization.guard';
import { MaterialModule } from './framework/material/material.module';
import { LearnersComponent } from './features/learners/learners.component';
import { CaptrLearnersComponent } from './features/captr-learners/captr-learners.component';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DigitalCoursesComponent } from './features/digital-courses/digital-courses.component';
import { FilterPipeModule } from './framework/pipes/filter.module';
import { OktaAuth } from '@okta/okta-auth-js';
// import { ConfigService } from './sessions/ConfigService';
import { OktaAuthModule } from '@okta/okta-angular';
import { environment } from 'src/environments/environment';
import { OAuthGuard } from './framework/guards/oauth.guard';

const oktaAuth = new OktaAuth({
  issuer: environment.issuer ,
  clientId: environment.clientId,
  // redirectUri: window.location.origin+'/sessions/login/callback',
  // postLogoutRedirectUri:window.location.origin+'/sessions/signin'
});


// export function appInitializerFn(configService: ConfigService) {
//   const data:any = configService.getConfig().toPromise().then(data=>{
//   if (data.id) {
    
    // localStorage.setItem('clientId', data.id);
    // localStorage.setItem('logoPath', data.logoPath);
    // localStorage.setItem('ApplicationID', data.appId);
    // localStorage.setItem('identifier', data.identifier)
    // localStorage.setItem('suAppId', data.serviceUserAppId);
    // localStorage.setItem('landingPage', data.landingPageUrl);
    // localStorage.setItem('primaryAppColour', data.primaryAppColour);
    // localStorage.setItem('secondaryAppColour', data.secondaryAppColour)
    
    // localStorage.setItem('isoAuthRequired', data.isoAuthRequired);
    // localStorage.setItem('oauthCallbackUrl', data.oauthCallbackUrl);
    // localStorage.setItem('oauthIssuer', data.oauthIssuer);
    // localStorage.setItem('oauthClientId', data.oauthClientId)
 
    // document.documentElement.style.setProperty('--primary-color', data.primaryAppColour);
    // document.documentElement.style.setProperty('--secondary-color', data.secondaryAppColour);

    
//     this.signinService();

//   }});

// }

@NgModule({
  declarations: [
    AppComponent,
    LearnersComponent,
    CaptrLearnersComponent,
    DigitalCoursesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // HttpRequestInterceptorModule,
    StepperNavigationModule,
    UserActivityModule,
    TranslateModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    SharedModule,
    MaterialModule,
    FormsModule,
    FilterPipeModule,
    // OktaAuthModule.forRoot({oktaAuth}),
  ],
  providers: [
    // { provide: APP_INITIALIZER, useFactory: appInitializerFn, deps: [ConfigService], multi: true },
    //  SessionsService , AuthenticationGuard , AuthorizationGuard ,ConfigService,OAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    // overlayContainer: OverlayContainer,
  //  private readonly sessionsService: SessionsService
    ) {
  //     overlayContainer.getContainerElement().classList.add('seq-theme');
  // }
  // setInitialData() {
  // }
}
// export  function getConfig():OktaAuth{
//   return new OktaAuth({
//     issuer: localStorage.getItem('oauthIssuer'),
//     clientId: localStorage.getItem('oauthClientId'),
//     redirectUri: localStorage.getItem('oauthCallbackUrl'),
//   });
}