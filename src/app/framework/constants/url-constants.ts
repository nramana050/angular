import { environment } from '../../../environments/environment';

export const BaseUrl = {
    LOGO: environment.logo,
    APPTITLE: environment.appTitle,
    azureBlobStorage: environment.azureBlobStorage,
    // CLIENT_URL: window.location.host,
    // PADHAI: environment.apiURL + '/sequation-ai-content-api',
    PADHAI: 'http://localhost:8099/sequation-ai-content-api',    
};
