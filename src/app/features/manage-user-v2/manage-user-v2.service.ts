import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ManageUserV2Service {

  constructor(private readonly http: HttpClient) { }

  getValidLicences(userType: number) {
    const href = `${BaseUrl.USER}/user-detail/check-licences/${userType}`;
    return this.http.get<any>(href);
  }
  getUserRoles(): Observable<any> {
    const href = `${BaseUrl.USER}/user/roles`;
    return this.http.get<any>(href);
  }

  getUserTypes() {
    const href = `${BaseUrl.USER}/user/userType`;
    return this.http.get<any>(href);
  }

  createUser(payload) {
    return this.http.post<any>(`${BaseUrl.USER}/manage-user-v2`, payload);
  }

  getRoles(){
    const href = `${BaseUrl.USER}/user/roles`;
    return this.http.get<any>(href);
  }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/manage-user-v2/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  getUserDetails(id) {
    const href = `${BaseUrl.USER}/manage-user-v2/${id}`;
    return this.http.get<any>(href);
  }


  updateUser(payload) {
    return this.http.put(`${BaseUrl.USER}/manage-user-v2`, payload, { responseType: 'text' });
  }

  resolveLoggedInUserRole() {
    return JSON.parse(atob(localStorage.getItem('token').split('.')[1])).roleId;
  }

  getDeleteReasonsRefData() {
    const href = `${BaseUrl.USER}/user/refData`;
    return this.http.get<any>(href);
  }


  deleteUser(payload) {
    const href = `${BaseUrl.USER}/manage-user-v2/deleteUser`;
    return this.http.post(href, payload, { responseType: 'text' });
  }

  getUserDetailsByRoleIdentifierAndAppId(roleidentifier, appId) {
    const href = `${BaseUrl.USER}/user/users-by-role-identifier`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('identifiers', roleidentifier)
        .set('appId',appId)
    });
  }

  getRegionData(){
    const href = `${BaseUrl.USER}/ref-data/regions`;
    return this.http.get<any>(href);
  }


  getRefDataAllDetails() {
    const href = `${BaseUrl.USER}/ref-data-choice/all`;
    return this.http.get<any>(href);
  }

  getOrganizations() {
    const href = `${BaseUrl.USER}/user/getAllOrganizationsAndFilter`;
    return this.http.get<any>(href);
  }
}
