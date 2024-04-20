import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpClient
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalConstantsService } from '../GobalAPIService/global-constants.service';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
    login: boolean;
    uri: any;

    constructor(private http: HttpClient, private router: Router) {
        this.uri = GlobalConstantsService.apiURL;
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const isApiUrl = request.url.startsWith(this.uri);
        let tokenDetails: any = sessionStorage.getItem('access_token');
        // this.router.events.subscribe(event => {
        //   if (event instanceof NavigationEnd) {
        // if (event.url != "/login" && event.url != "/forgot-password" && !event.url.includes("/unsubscribe") && !event.url.includes("/reset-password") && event.url != "/" && !event.url.includes("/sign-up")) {

        //   if (sessionStorage.getItem("customerId") === null || sessionStorage.getItem("customerId") === undefined || sessionStorage.getItem("customerId") === 'null' || sessionStorage.getItem("customerId") === ""
        //     || sessionStorage.getItem("tokenNo") === null || sessionStorage.getItem("tokenNo") === undefined || sessionStorage.getItem("tokenNo") === 'null' || sessionStorage.getItem("tokenNo") === "") {
        //     this.router.navigate(['/login']);
        //   }
        // }
        //   }
        // });


        // if(sessionStorage.getItem('data')!=null && sessionStorage.getItem('data') !='' && sessionStorage.getItem('data')&&sessionStorage.getItem('data')!=undefined){
        if (isApiUrl && tokenDetails != null) {
            
            // let currentUrl = window.location.href;


            if (tokenDetails != null && tokenDetails != undefined && tokenDetails != "" && tokenDetails != "null") {
                request = request.clone({
                    headers: request.headers.set('Authorization', "Bearer " + tokenDetails)
                });
            }
        }
        // }
        return next.handle(request);
    }



}
