import {Inject, Injectable, NgModule } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HTTP_INTERCEPTORS,
    HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';

import { SnackBarService } from './snack-bar.service';
import { ValidatorService } from '../components/form-control-messages/validator.service';
import { SessionsService } from '../../sessions/sessions.service';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Injectable({
    providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(
        public router: Router,
        public sessionsService: SessionsService,
        public snackBar: SnackBarService,
        private readonly validatorService: ValidatorService,
        @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');
        request = request.clone({
            headers: request.headers.set('X-Authorization', 'Bearer ' + token)
                .set('Content-Type', 'application/json'),
            url: request.url.replace('#', '')      
        });
        return next.handle(request).pipe(
            tap(
                (response: HttpEvent<any>) => {
                    //this is intentional
                },
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        console.log(err)
                        if (err.status === 401) {
                            const error =  err.error.applicationMessage || 'UnAuthorized User';
                            this.sessionsService.signout().subscribe();
                            this.snackBar.showCustomSnackBar(error, 'Dismiss', { duration: 6000 });
                        }
                        if (err.status === 422) {
                            if(err.error.errors != null){
                                err.error.applicationMessage = err.error.errors[0].errorMessage
                            } else {
                                err.error.applicationMessage = err.error.applicationMessage
                            }
                        }

                    }
                }
            )
        );
    }
}

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestInterceptor,
            multi: true
        }
    ]
})
export class HttpRequestInterceptorModule { }
