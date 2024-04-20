import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleCreationService {

  constructor(
    private readonly http: HttpClient
  ) { }

  createRole(data) {
    const href = `${BaseUrl.USER}/roles`
    return this.http.post<any>(href, data);
  }

  updateRole(data) {
    const href = `${BaseUrl.USER}/roles`
    return this.http.put<any>(href, data);
  }

  getRoleDetails(roleId: any) {
    const href = `${BaseUrl.USER}/roles/${roleId}`
    return this.http.get<any>(href);
  }

  getConfigurationRefDataDetails(id) {
    const href = `${BaseUrl.USER}/roles/configuration/${id}`
    return this.http.get<any>(href);
  }

  createConfiguration(data) {
    const href = `${BaseUrl.USER}/roleConfig`
    return this.http.post<any>(href, data);
  }
  getFeatures(data) {
    const href = `${BaseUrl.USER}/rbac-permission/search`
    return this.http.post<any>(href, data);
  }

  getSelectedFeatures(roleId) {
    const href = `${BaseUrl.USER}/rbac-permission/${roleId}`
    return this.http.get<any>(href);
  }

  saveRbacPermission(data) {
    const href = `${BaseUrl.USER}/rbac-permission`
    return this.http.post<any>(href, data);
  }

  deleteRole(roleId: any) {
    const href = `${BaseUrl.USER}/roles/${roleId}`
    return this.http.delete<any>(href);
  }

  activateRole(roleId) {
    const href = `${BaseUrl.USER}/roleConfig/activateRole/${roleId}`
    return this.http.post<any>(href, roleId);

  }
  getRoleConfigDetails(roleId) {
    const href = `${BaseUrl.USER}/roleConfig/${roleId}`
    return this.http.get<any>(href);
  }

  getRefData(){
    const href = `${BaseUrl.USER}/rbac-permission/refData`
    return this.http.get<any>(href);
  }

  getMoodleRoleList(): Observable<any> {
    const href = `${BaseUrl.MOODLE_API}/moodle-roles/get-roles`
    return this.http.get<any>(href);
  }
}
