import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { SessionsService } from '../sessions.service';
import { MatButton } from '@angular/material/button';
import { SnackBarService } from '../../framework/service/snack-bar.service';
import { IUserMessage } from './signin.interface';
import { ApplicationConstant } from '../../framework/constants/app-constant';
import { AppConfirmService } from '../../framework/components/app-confirm/app-confirm.service';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { AppInsightsService } from '../../framework/service/app-insights.service';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { Observable } from 'rxjs';
import OktaAuth, { AuthState } from '@okta/okta-auth-js';
import { filter, map } from 'rxjs/operators';
import id from 'date-fns/esm/locale/id/index.js';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    providers: [SessionsService],
})

export class SigninComponent implements OnInit {

    signinForm: FormGroup;
    signinError: IUserMessage;
    @ViewChild(MatButton, { static: false }) submitButton: MatButton;

    public name: Observable<string>;
    public isAuthenticated$!: Observable<boolean>;
    isoAuthRequired:boolean = false;

    constructor(private readonly router: Router,
        private readonly sessionsService: SessionsService,
        private readonly builder: FormBuilder,
        private readonly snackBar: SnackBarService,
        private readonly appConfirmService: AppConfirmService,
        private readonly appInsightsService: AppInsightsService,
        private readonly _oktaStateService:OktaAuthStateService,
        @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth
        
    ) {
        this.getClientConfig();
    }

    getPayloadForSSoLogin():any{

         let payload = null;
        const clientId = localStorage.getItem('clientId')
        const clientIdentifier = localStorage.getItem('identifier')
        const appId = localStorage.getItem('ApplicationID')
        const idToken:any = this._oktaStateService.authState$.pipe(
            filter((authState: AuthState) => !!authState && !!authState.isAuthenticated),
            map((authState: AuthState) => authState.idToken ?? null)
        );
        idToken.subscribe(value=>{
            payload =  {"appId":appId , "clientId":clientId,"clientIdentifier":clientIdentifier,"token":this._oktaAuth.getIdToken(),"authStrategy":"SINGLE_SIGN_ON"};                       
        })
        return payload; 
    }

    ngOnInit() {
        this.initForm();
        if(localStorage.getItem('isoAuthRequired') === "true"){
            this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
                filter((s: AuthState) => !!s),
                map((s: AuthState) => s.isAuthenticated ?? false)
              );
              this.isAuthenticated$.subscribe(value=>{
                    if(value){
                       let payload = this.getPayloadForSSoLogin();
                       this.oAuthSigninService(payload);  
                    }else{
                        console.log("SSO Login Failed");
                    }
              }) 
        }
    }
    
    signin() {
        
        this.appInsightsService.logEvent('KW Login', {username: this.signinForm.get('userName').value});
        let clarity = window['clarity'];
        console.log(clarity, "clarity")
        clarity("set", "userName",`${this.signinForm.get('userName').value}`);
        clarity("set", "userId",`${this.signinForm.get('userName').value}`);
        this.sessionsService.getClientDetails().subscribe(data => {
            if (data.id) {
                clarity("set", "clientId",`${data.id}`);
                clarity("set", "ApplicationID",`${data.appId}`);
                clarity("set", "suAppId",`${data.serviceUserAppId}`);
                
                localStorage.setItem('clientId', data.id);
                localStorage.setItem('logoPath', data.logoPath);
                localStorage.setItem('ApplicationID', data.appId);
                localStorage.setItem('suAppId', data.serviceUserAppId);
                localStorage.setItem('landingPage', data.landingPageUrl);
                localStorage.setItem('primaryAppColour', data.primaryAppColour);
                localStorage.setItem('secondaryAppColour', data.secondaryAppColour)
                localStorage.setItem('isoAuthRequired', data.isoAuthRequired);
                localStorage.setItem('oauthCallbackUrl', data.oauthCallbackUrl);
                localStorage.setItem('oauthIssuer', data.oauthIssuer);
                localStorage.setItem('oauthClientId', data.oauthClientId)
                localStorage.setItem('identifier', data.identifier)
                document.documentElement.style.setProperty('--primary-color', data.primaryAppColour);
                document.documentElement.style.setProperty('--secondary-color', data.secondaryAppColour);
                this.signinService();
            }
        });
    }

    async  signinWithSSO() {
        await this._oktaAuth.signInWithRedirect().then(x=>{
            console.log("-----------Auth response---------");
        })
    }

    getClientConfig(){
        this.sessionsService.getClientDetails().subscribe(data => {
            if (data.id) {
                localStorage.setItem('clientId', data.id);
                localStorage.setItem('logoPath', data.logoPath);
                localStorage.setItem('ApplicationID', data.appId);
                localStorage.setItem('suAppId', data.serviceUserAppId);
                localStorage.setItem('landingPage', data.landingPageUrl);
                localStorage.setItem('primaryAppColour', data.primaryAppColour);
                localStorage.setItem('secondaryAppColour', data.secondaryAppColour)
                localStorage.setItem('isoAuthRequired', data.isoAuthRequired);
                localStorage.setItem('oauthCallbackUrl', data.oauthCallbackUrl);
                localStorage.setItem('oauthIssuer', data.oauthIssuer);
                localStorage.setItem('oauthClientId', data.oauthClientId)
                localStorage.setItem('identifier', data.identifier)
                document.documentElement.style.setProperty('--primary-color', data.primaryAppColour);
                document.documentElement.style.setProperty('--secondary-color', data.secondaryAppColour);
                if(localStorage.getItem('isoAuthRequired') === "true"){
                    this.isoAuthRequired = true;
                }
            }
        });

    }

    signinService() {
        this.signinForm.controls['pass'].setValue(btoa(this.signinForm.controls['pass'].value));
        this.sessionsService.signin(this.signinForm.value)
            .subscribe((data: HttpResponse<any>) => {
                if(data.body.landingPageUrl!=null)
                {
                    localStorage.setItem('landingPage', data.body.landingPageUrl);  
                }
                this.router.navigate([localStorage.getItem('landingPage')])
                if (data.body.isPasswordAboutToExpire) {
                    this.sessionsService.setPasswordAboutToExpireFlag(true)
                    const numberOfdaysLeft = data.body.passwordAboutToExpireDays;
                    const dialogRef = this.appConfirmService.confirm({
                        title: `Please change your password`,
                        message: `Your password will expire in ${numberOfdaysLeft} day/s.
                      Select \'OK\' to change your password now or \'Cancel\' to change it later.`,
                    });
                    dialogRef.subscribe(result => {
                        if (result) {
                            this.router.navigateByUrl('/user-setting/change-password');
                        }
                    });
                }

            },
                (error: any) => {
                    this.snackBar.error(error.error.applicationMessage || error.message);
                    this.signinForm.controls['pass'].setValue(atob(this.signinForm.controls['pass'].value));
                    if (error.error.applicationMessageCode === 'U4006') {
                        localStorage.setItem('username', this.signinForm.controls['userName'].value);
                        this.router.navigate(['sessions/change-expired-password']);
                    }
                }
            );
    }

    oAuthSigninService(data) {
        this.sessionsService.signinWithSSOLogin(data)
            .subscribe((data: HttpResponse<any>) => {
                if(data.body.landingPageUrl!=null)
                {
                    localStorage.setItem('landingPage', data.body.landingPageUrl);  
                }
                this.router.navigate([localStorage.getItem('landingPage')])
                if (data.body.isPasswordAboutToExpire) {
                    this.sessionsService.setPasswordAboutToExpireFlag(true)
                    const numberOfdaysLeft = data.body.passwordAboutToExpireDays;
                    const dialogRef = this.appConfirmService.confirm({
                        title: `Please change your password`,
                        message: `Your password will expire in ${numberOfdaysLeft} day/s.
                      Select \'OK\' to change your password now or \'Cancel\' to change it later.`,
                    });
                    dialogRef.subscribe(result => {
                        if (result) {
                            this.router.navigateByUrl('/user-setting/change-password');
                        }
                    });
                }
            },
                (error: any) => {
                    this.snackBar.error(error.error.applicationMessage || error.message);
                    this.signinForm.controls['pass'].setValue(atob(this.signinForm.controls['pass'].value));
                    if (error.error.applicationMessageCode === 'U4006') {
                        localStorage.setItem('username', this.signinForm.controls['userName'].value);
                        this.router.navigate(['sessions/change-expired-password']);
                    }
                    this.signOut();
                }
            );
    }

    public async signOut(): Promise<void> {
        await this._oktaAuth.signOut();
        localStorage.clear();
    }



    initForm() {
        this.signinForm = this.builder.group({
            userName: ['', Validators.required],
            pass: ['', Validators.required],
        });
    }

}

