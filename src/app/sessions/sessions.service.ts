import { Injectable, NgZone, Output, EventEmitter, Inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { BaseUrl } from '../framework/constants/url-constants';
import { AppInsightsService } from '../framework/service/app-insights.service';
import { Utility } from '../framework/utils/utility';
import { BehaviorSubject } from 'rxjs';
import { ImageUrl } from '../framework/constants/image--url-constant';
import OktaAuth from '@okta/okta-auth-js';

const authHeaderString = 'X-Authorization';
const contentTypeHeaderString = 'application/json';

const signInHttpHeaders = new HttpHeaders({
  'Content-Type': contentTypeHeaderString
});

//@Directive()
@Injectable()
export class SessionsService {
  @Output() passwordAboutToExpiredFlag: EventEmitter<boolean> = new EventEmitter();
  private readonly logoUrl = new BehaviorSubject<string>(ImageUrl.LOGO_IMAGE);
  currentLogo = this.logoUrl.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly zone: NgZone,
    private readonly appInsightsService: AppInsightsService,
  ) { }

  changeLogo(logo: string){
    this.logoUrl.next(logo);
  }

  signin(data: any): any {
    data.appId = localStorage.getItem('ApplicationID')
    data.clientId = localStorage.getItem('clientId')
    return this.http.post<any>(BaseUrl.AUTHENTICATE + '/login', data, { headers: signInHttpHeaders, observe: 'response' })
      .pipe(
        tap(resp => {
          this.resolveSessionParams(resp);

        })
      );
  }

  signout() {
    this.appInsightsService.clearAuthenticatedUserContext();
    if(localStorage.getItem('isoAuthRequired') === "true"){
     return this.http.get(BaseUrl.AUTHENTICATE + '/logoutUser')
        .pipe(finalize(() => this.oktaSignOut()));
    }else{
      return this.http.get(BaseUrl.AUTHENTICATE + '/logoutUser')
        .pipe(finalize(() => this.onSignoutTap()));
    }
  }

  onSignoutTap() {
    if(localStorage.getItem("moodleUrl")!='null'){
      this.zone.run(() => {
        window.location.href = `${localStorage.getItem('moodleUrl')}/login/logout.php`;
      });
    }
    this.router.navigate(['/sessions/signin']);
    let darkmodeConfig = localStorage.getItem('darkmode');
    localStorage.clear();
    localStorage.setItem('darkmode', darkmodeConfig);
  }

  resolveSessionParams(resp) {
    const xAuthToken = resp.headers.get(authHeaderString).split(' ');
    const token = xAuthToken[1];
    localStorage.setItem('token', token);
    if (resp.body.heartbeat) {
      localStorage.setItem('session', btoa(JSON.stringify(resp.body)));
    }
  }

  hasResource(auth: string[]) {

    if (localStorage.getItem('token') && auth) {
      const payload = atob(localStorage.getItem('token').split('.')[1]);
      const permissions = JSON.parse(payload).listResource;

      if (auth[1] && permissions.filter(feature => +feature.fid === +auth[0])[0]) {
        return !!permissions.filter(feature => +feature.fid === +auth[0])[0].opId.find(operation => +operation === +auth[1]);
      } else {
        return !!permissions.find(permission => +permission.fid === +auth[0]);
      }
    }
    return false;
  }

  getRoleId() {
    if (localStorage.getItem('token')) {
      const tokenBody = atob(localStorage.getItem('token').split('.')[1]);
      const payload = JSON.parse(tokenBody);
      return payload.roleId;
    }
    return 0;
  }

  refreshToken() {

    return this.http.get<any>(`${BaseUrl.AUTHENTICATE}/refreshToken`, { observe: 'response' })
      .pipe(
        tap(resp => {
          this.resolveSessionParams(resp);
        }));
  }
  isRehabSupervisor(roleList) {
    let isValid = false;
    const roleId = this.getRoleId();
    if (roleId !== -1) {
      const role = Utility.getObjectFromArrayByKeyAndValue(roleList, 'roleId', roleId);
      if (role !== null && role.identifier === 'RHS') {
        isValid = true;
      }
    }
    return isValid;
  }
  getClientOrganizations() {
    const href = `${BaseUrl.USER}/user/organizations`;
    return this.http.get<any>(href);
  }

  changeEstablishment(estbId) {
    return this.http.post<any>(`${BaseUrl.AUTHENTICATE}/changeEstablishment/${estbId}`, estbId, { headers: signInHttpHeaders, observe: 'response' })
      .pipe(
        tap(resp => {
          this.resolveSessionParams(resp);
        }),
      );
  }

  setPasswordAboutToExpireFlag(flag) {
    localStorage.setItem('passwordCheck', JSON.stringify(flag));
    this.passwordAboutToExpiredFlag.emit(flag);

  }

  getClientDetails() {
    const url = BaseUrl.CLIENT_URL;
    const href = `${BaseUrl.USER}/clients/getByUrl`;
    return this.http.get<any>(href, { params: new HttpParams().set('url', url) });
  }

  signinWithSSOLogin(data: any): any {
    return this.http.post<any>(BaseUrl.USER + '/v2/login', data, { headers: signInHttpHeaders, observe: 'response' })
      .pipe(
        tap(resp => {
          this.resolveSessionParams(resp);

        })
      );
  }

  public async oktaSignOut(): Promise<void> {
    const oktaAuthObj:any = new OktaAuth({
      issuer: localStorage.getItem('oauthIssuer') ,
      clientId: localStorage.getItem('oauthClientId'),
      redirectUri: localStorage.getItem('oauthCallbackUrl'),
      postLogoutRedirectUri: window.location.origin+'/sessions/signin'
    });
    oktaAuthObj.signOut();
    let darkmodeConfig = localStorage.getItem('darkmode');
    localStorage.setItem('darkmode', darkmodeConfig);
    window.location.href = `${localStorage.getItem('moodleUrl')}/login/logout.php`;
    this.zone.run(() => {
       this.router.navigate(['/sessions/signin'])
    });
     localStorage.clear();
     sessionStorage.clear();
  }

}
