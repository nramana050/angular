export class User {
    id: number;
    username?: string;
    name?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    jwtToken?: string;
    refresh_token?: string;
    access_token?: string;
    expires_in?: number;
    jti?: string;

    scope?: string;
    token_type?: string;
    companyLogo?: string;
    primaryEmail?: string;
    userRole?: number;
    companyId?: number;
}