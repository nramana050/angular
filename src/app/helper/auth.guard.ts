import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { I18nService } from 'src/app/service/i18n.service';
// import { RoleService } from 'src/app/service/role.service';
// import { ToastService } from 'src/app/service/toast.service';
import { AuthServicesService } from 'src/app/auth/auth-services/auth-services.service';



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthServicesService,
        // private authservice: AuthServicesService
    ) {
        // console.log("hihiihihih");

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authenticationService.isUserLogin()) {
            // console.log("true");

            return true;
        } else {
            // not logged in so redirect to login page with the return url
            // console.log("false");
            // this.router.events.subscribe(event => {
                // if (event instanceof NavigationEnd) {
                    if (this.router.url != "/login" && this.router.url != "/forgot-password" && !this.router.url.includes("/unsubscribe") && !this.router.url.includes("/reset-password") && this.router.url != "/" && !this.router.url.includes("/sign-up")) {

                        // if (sessionStorage.getItem("customerId") === null || sessionStorage.getItem("customerId") === undefined || sessionStorage.getItem("customerId") === 'null' || sessionStorage.getItem("customerId") === ""
                        //     || sessionStorage.getItem("tokenNo") === null || sessionStorage.getItem("tokenNo") === undefined || sessionStorage.getItem("tokenNo") === 'null' || sessionStorage.getItem("tokenNo") === "") {
                            this.authenticationService.redirectToLogin();
                        // }
                    }
                // }
            // });

            // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            this.authenticationService.redirectToLogin();
            return false;
        }
    }
}