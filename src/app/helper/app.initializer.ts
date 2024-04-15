import { AuthServicesService } from 'src/app/auth/auth-services/auth-services.service';

 

export function appInitializer(authenticationService: AuthServicesService) {

    return () => new Promise(resolve => {
        var authService = authenticationService.refreshToken();

        // attempt to refresh token on app start up to auto authenticate
        if (authService) {
            authService
                .subscribe()
                .add(resolve);
        }
    });
}