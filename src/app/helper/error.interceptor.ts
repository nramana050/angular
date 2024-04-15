import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthServicesService } from 'src/app/auth/auth-services/auth-services.service';

 
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthServicesService,private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.authenticationService.userValue()) {
                // auto logout if 401 or 403 response returned from api
                // console.log("dmsm");
                
                if ( this.router.url != '/' && this.router.url != '/login')
                this.authenticationService.logout();
                console.log("not auth");
            }
         //   const error = (err && err.error && err.error.message) || err.statusText;
            console.log(err,"error");
            return throwError(err);
           
        }))
    }
}