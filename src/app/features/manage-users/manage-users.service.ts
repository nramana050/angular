import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseUrl } from '../../framework/constants/url-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {

  constructor(private readonly http: HttpClient) { }

  getUserRoles(): Observable<any> {
    const href = `${BaseUrl.USER}/user/roles`;
    return this.http.get<any>(href);
  }

  getUserTypes() {
    const href = `${BaseUrl.USER}/user/userType`;
    return this.http.get<any>(href);
  }

  createUser(payload) {
    return this.http.post<any>(`${BaseUrl.USER}/user`, payload);
  }

  getRoles(){
    const href = `${BaseUrl.USER}/user/roles`;
    return this.http.get<any>(href);
  }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/user/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  getUserDetails(id) {
    const href = `${BaseUrl.USER}/user/${id}`;
    return this.http.get<any>(href);
  }


  updateUser(payload) {
    return this.http.put(`${BaseUrl.USER}/user`, payload, { responseType: 'text' });
  }

  resolveLoggedInUserRole() {
    return JSON.parse(atob(localStorage.getItem('token').split('.')[1])).roleId;
  }

  getDeleteReasonsRefData() {
    const href = `${BaseUrl.USER}/user/refData`;
    return this.http.get<any>(href);
  }


  deleteUser(payload) {
    const href = `${BaseUrl.USER}/user/deleteUser`;
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

  getCohortRefData() {
    const href = `${BaseUrl.USER}/ref-data/cohort`;
    return this.http.get<any>(href);
  }

  getFilterUserList(id) {
    const href = `${BaseUrl.USER}/user/getFilteredUserList/${id}`;
    return this.http.get<any>(href);
  }

  changeUserRole(payload) {
    return this.http.put(`${BaseUrl.USER}/user/changeUserRole`, payload);
  }
  
  getValidLicences(userType: number) {
    const href = `${BaseUrl.USER}/user-detail/check-licences/${userType}`;
    return this.http.get<any>(href);
  }

  getAllSuUserByLggedInClient() {
    const href = `${BaseUrl.USER}/serviceUser/getAllSuUsers`;
    return this.http.get<any>(href);
  }

  getAllocatedRefData(){
    const href = `${BaseUrl.USER}/participant-v6/organizations`;
    return this.http.get<any>(href);
  }

  getOrganizations() {
    const href = `${BaseUrl.USER}/user/getAllOrganizationsAndFilter`;
    return this.http.get<any>(href);
  }
}
