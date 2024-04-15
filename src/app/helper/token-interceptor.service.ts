import { ErrorHandler, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { throwError } from 'rxjs';
import { AuthServicesService } from 'src/app/auth/auth-services/auth-services.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { GlobalConstantsService } from '../GobalAPIService/global-constants.service';
import { PreviewService } from '../GobalAPIService/global-service-service/PreviewService';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false;
    // Refresh Token Subject tracks the current token, or is null if no token is currently
    // available (e.g. refresh pending).
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );
    serverUri: any;
    apiUri: string;
    secureApiUri: string;
    constructor(public authenticationService: AuthServicesService, private router: Router, public previewService: PreviewService) {
        // if (environment.debug ) console.log("loat http intercept ");
        this.serverUri = GlobalConstantsService.serverApiURL;
        this.apiUri = GlobalConstantsService.apiURL;
        this.secureApiUri = GlobalConstantsService.secureApiURL;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // const isApiLoginUrl = request.url.startsWith(this.serverUri + "/oauth/token?grant_type=password");
        const user = this.authenticationService.userValue();
        const isApiUrl = request.url.startsWith(this.serverUri);
        const isUrl = request.url.startsWith(this.apiUri);
        const isSecureUrl = request.url.startsWith(this.secureApiUri);

        if (!isApiUrl && !isSecureUrl && !isUrl && user && !user.refresh_token) {
            if (this.router.url != '/' && this.router.url != '/login')
                this.authenticationService.redirectToLogin();
            return throwError("Fail");
        } else {
            // const isLoggedIn = user && user.access_token;
            // console.log("inside if");

            if (isApiUrl) {
                // console.log("intercepting");

                request = request.clone({
                    setHeaders: {
                        Authorization: `Basic ${sessionStorage.getItem('auth')}`
                    }
                    // request =
                    // res.header("Access-Control-Allow-Origin", "*");
                    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

                });
                // console.log(request, "request 9000");
            }
            else if (isSecureUrl && !isApiUrl && !isUrl) {
                let tokenNo: any = sessionStorage.getItem('access_token');

                // request = request.clone({
                //     headers: request.headers.set('Authorization', "Bearer " + tokenNo)
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${tokenNo}`
                    }
                });
                // console.log(request, "request 8080");
            }
            else if(!isSecureUrl && !isApiUrl && isUrl){
                request = request;
            }
            else {
                request = this.addAuthenticationToken(request);
            }


            return next.handle(request)
                .pipe(catchError(error => {
                    const isApiLoginUrl = request.url.startsWith(this.serverUri + "/oauth/token?grant_type=password");
                    // if (isApiUrl) {
                    //     return throwError("Fail");
                    // }
                    // else if (isUrl && !isApiUrl) {
                    //     return throwError("Fail");
                    // }
                    if (user) {
                        console.log("inside return",user);
                        if(user.id == 0){
                            this.previewService.setloginFlag = false;
                            console.log(this.previewService.getloginFlag);
                            
                        }
                        
                        if (user.refresh_token) {
                            // We don't want to refresh token for some requests like login or refresh token itself
                            // So we verify url and we throw an error if it's the case
                            if (request.url.includes("refresh-token") ||
                                request.url.includes("login")) {
                                // We do another check to see if refresh token failed
                                // In this case we want to logout user and to redirect it to login page

                                if (request.url.includes("refresh-token")) {
                                    this.authenticationService.logout();
                                }
                                return throwError(error);

                            }

                            // If error status is different than 401 we want to skip refresh token
                            // So we check that and throw the error if it's the case
                            // if (error.status != undefined && error.status !== 401) {
                            if (error.status != 401) {
                                //return Observable.throw(error);
                                return throwError(error);
                            }

                            if (this.refreshTokenInProgress) {
                                // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
                                // – which means the new token is ready and we can retry the request again
                                return this.refreshTokenSubject.pipe(
                                    filter(token => token != null),
                                    take(1),
                                    switchMap(() => next.handle(this.addAuthenticationToken(request)))
                                );
                            }
                            else {
                                this.refreshTokenInProgress = true;

                                // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
                                this.refreshTokenSubject.next(null);

                                //Call auth.refreshAccessToken(this is an Observable that will be returned)

                                return this.authenticationService.refreshToken()
                                    .pipe(switchMap((token: any) => {
                                        //When the call to refreshToken completes we reset the refreshTokenInProgress to false
                                        // for the next time the token needs to be refreshed

                                        const user = this.authenticationService.userValue();
                                        this.refreshTokenInProgress = false;
                                        /*  if (isLoggedIn && isApiUrl) {
                                             if (request.url.indexOf("/users/refresh-token") != -1 || request.url.indexOf("/users/revoke-token") != -1) {
                                                 request = request.clone({
                                                     setHeaders: {
                                                         'Authorization': `Bearer ${user.jwtToken}`
 
                                                     }
 
                                                 });
                                                 request.headers.append('refreshToken', !user.refresh_token ? '' : user.refreshToken);
 
 
                                             }
                                             else {
                                                 request = request.clone({
                                                     setHeaders: { Authorization: `Bearer ${user.jwtToken}` }
                                                 });
                                             }
                                             sessionStorage.setItem("data", JSON.stringify(user));
                                             console.log("new access token received");
                                         } */
                                        this.refreshTokenSubject.next(token);
                                        return next.handle(this.addAuthenticationToken(request));
                                    })
                                        // .cat
                                        //     ((error: any) => {
                                        //         this.refreshTokenInProgress = false;
                                        //         this.authenticationService.logout();
                                        //         return throwError(error);
                                        //     })
                                    );
                            }
                        }
                    }
                    else{
                        this.previewService.setloginFlag = false;
                        console.log(this.previewService.loginFlag);
                        
                        console.log("error 1");
                    }
                }));
    }
    }

    addAuthenticationToken(request: any) {
        const user = this.authenticationService.userValue();
        // Get access token from Local Storage
        if (!user) {
            return request;
        }
        const accessToken = `Bearer ${user.access_token}`;

        // If access token is null this means that user is not logged in
        // And we return the original request
        if (!accessToken) {
            return request;
        }
        // if (environment.debug ) console.log(request.url);
        // We clone the request, because the original request is immutable
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${user.access_token}`
            }
        });
    }
}