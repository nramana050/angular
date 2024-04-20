import { environment } from '../../../environments/environment';

export const BaseUrl = {
    AUTHENTICATE: environment.apiURL +'/sequation-user-api',
    USER: environment.apiURL +'/sequation-user-api',
    POWERBI: environment.apiURL + '/sequation-report-api',
    LOGO: environment.logo,
    APPTITLE: environment.appTitle,
    AUTHORIZATION: environment.apiURL + '/sequation-authorization-api',
    azureBlobStorage: environment.azureBlobStorage,
    // CLIENT_URL: window.location.host,
    CLIENT_URL: 'dev-staff.captr.online',

    COMPLY: environment.apiURL + '/sequation-comply-api',
    JOBS : environment.apiURL + '/sequation-job-v2-api',
    CVB: environment.apiURL + '/sequation-cv-builder-v2-api',
    PLAN :  environment.apiURL +'/sequation-plan-v2-api',
    ASSESSMENT: environment.apiURL + '/sequation-community-assessment-api',
    CONTENT_MANAGEMENT: environment.apiURL +'/sequation-content-management-v2-api',
    OPENVIDU :  environment.apiURL +'/sequation-openvidu-v2-api',
    Document: environment.apiURL + '/sequation-document-v2-api',
    SRM: environment.apiURL + '/sequation-srm-v2-api',
    REPORTS_BI: environment.reportsBiUrl,
    REPORT: environment.apiURL + '/sequation-report-api',
    // GENAIE: environment.apiURL + '/sequation-ai-content-api',
    GENAIE: 'http://localhost:8099/sequation-ai-content-api',

    MOODLE_API: environment.apiURL +'/sequation-moodle-v2-api',
    MOODLE_URL: localStorage.getItem('moodleUrl') + '/',
    
};
