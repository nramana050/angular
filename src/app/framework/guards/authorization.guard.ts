import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionsService } from '../../sessions/sessions.service';


@Injectable()
export class AuthorizationGuard implements CanActivate, CanActivateChild {

    constructor(
        protected router: Router,
        protected sessionsService: SessionsService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        if (this.sessionsService.hasResource(route.data['auth']) || this.sessionsService.hasResource(route.data['auth2nd'])) {
            return true;
        }

        this.router.navigate(['sessions']);
        return false;
    }

    canActivateChild(childroute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.canActivate(childroute, state);
    }

}


