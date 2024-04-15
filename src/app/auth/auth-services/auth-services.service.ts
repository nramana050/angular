import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstantsService } from 'src/app/GobalAPIService/global-constants.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/helper/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServicesService {

  uri: any;
  customerId: any;
  serverUri: any;
  secureUri: any;

  public userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public userStoreValue: User;
  public myHeaders = new HttpHeaders();
  public loginUser: User | undefined;

  constructor(private http: HttpClient, private router: Router) {
    this.uri = GlobalConstantsService.apiURL;
    this.serverUri = GlobalConstantsService.serverApiURL;
    this.secureUri = GlobalConstantsService.secureApiURL;
    this.customerId = sessionStorage.getItem("customerId");
    let user = sessionStorage.getItem('data');
    let userSession: User = { id: 0 };
    if (user)
      userSession = JSON.parse(user);
    this.userSubject = new BehaviorSubject<User>(userSession);
    this.user = this.userSubject.asObservable();
    this.userSubject.subscribe(user => {
      this.userStoreValue = user;
      this.loginUser = undefined;
    });
  }

  checkEmailDuplication(email) {
    return this.http.get<any>(`${this.uri}/signup/checkEmailDuplication/` + email)
  }

  Login(userName, oldPassword1) {
    const obj = {
      userName,
      oldPassword1,
    };
    return this.http.post<any>(`${this.secureUri}/auth/signin`, obj)
  }

  getUniqueUsername(email) {
    return this.http.get<any>(`${this.secureUri}/login/profileDetails/` + email)
  }

  signUp(signupInfo) {
    return this.http.post<any>(`${this.uri}/signup/registerCustomer`, signupInfo)
  }

  forgotPass(forgot) {
    return this.http.post<any>(`${this.uri}/signup/forgotPassword`, forgot)
  }

  genratePassword(user) {
    return this.http.post<any>(`${this.uri}/signup/savePasswordAndSignIn`, user)
  }

  emailCheckgenratepassword(user) {
    return this.http.post<any>(`${this.uri}/signup/confirmCustomerDetail`, user)
  }

  UpdateDailySession(dailySessionInfo) {
    return this.http.post<any>(`${this.uri}/signup/UpdateDailySession`, dailySessionInfo)
  }

  getDailySession(dailySessionKey) {
    // console.log(dailySessionKey);

    return this.http.get<any>(`${this.secureUri}/contact/getDailySession/` + dailySessionKey)
  }

  public getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  }


  public getIpDetails(ipAddress, key) {
    return this.http.get("https://ipwhois.pro/json/" + ipAddress + "?" + key);
  }

  changePassword(user) {
    return this.http.post<any>(`${this.secureUri}/email/changePassword/` + this.customerId, user)
  }

  saveContactUs(contactUsData) {
    return this.http.post<any>(`${this.secureUri}/contact/saveContactUs`, contactUsData)
  }

  serverLogin(username: string, password: string) {
    let authData = window.btoa('angular_id' + ":" + 'Hello@123');
    sessionStorage.setItem("auth", authData);

    return this.http.post<any>(`${this.serverUri}/oauth/token?grant_type=password`
      , {}, { params: { username, password } })
      .pipe(map(user => {
        // console.log("inside auth service login");
        this.userSubject.next(user);

        sessionStorage.setItem("data", JSON.stringify(user));
        sessionStorage.setItem("access_token", user.access_token);
        // this.Login(username,password);
        return user;
      }),
        catchError((error: HttpErrorResponse) => {
          console.log(error,"hgf");
          return throwError(error);
        })
      );
  }

  public userValue(): User {
    // return this.userSubject.value;
    // console.log(this.userStoreValue,"lkjhg");
      if (!this.userStoreValue ) {
        let data: any;
        data = sessionStorage.getItem('data');
        if (data)
          this.userStoreValue = JSON.parse(data);
      }
      
    return this.userStoreValue;

  }
  public isUserLogin() {
    if (!this.loginUser) {
      this.loginUser = this.userValue();
      // console.log(this.loginUser,"**");

    }
    if (this.loginUser && this.loginUser.access_token) {
      // console.log("return true");

      return true;
    }
    // console.log("return false");

    return false;
  }

  logout() {
    if (sessionStorage.getItem("data")) {
      // this.http.post<any>(`${environment.urlOauth2}/users/revoke-token`, {}, { withCredentials: true }).subscribe();
      this.stopRefreshTokenTimer();
      this.userSubject.next({ id: 0 });
      this.loginUser = undefined;
      //this.router.navigate(['/login']);


      var form = document.createElement("form");
      form.setAttribute("method", "GET");
      form.setAttribute("action", document.location.href);
      document.body.appendChild(form);
      form.submit();
    }
  }

  public refreshToken(): any {
    // console.log("getting refresh token");

    let data: any = sessionStorage.getItem("data");
    let userData = JSON.parse(data);
    //       this.myHeaders = this.myHeaders.set("refreshToken", userData.refreshToken);

    if (userData.refresh_token) {
      return this.http.post<any>(`${this.serverUri}/oauth/token?grant_type=refresh_token`,
        {},
        {
          headers: this.myHeaders,
          withCredentials: true,
          params: { refresh_token: userData.refresh_token }
          
        })
        .pipe(map((user) => {
          userData.access_token = user.access_token;
          this.userSubject.next(userData);
          sessionStorage.setItem("data", JSON.stringify(userData));
          sessionStorage.setItem("access_token", user.access_token);

          return user;
        }),
          catchError((error: HttpErrorResponse) => {
            this.logout();
            console.log("Refresh token Error : " + error);
            return throwError(error);
          })
        );
    }
  }

  private stopRefreshTokenTimer() {
    sessionStorage.clear();
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
