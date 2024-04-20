import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { BaseUrl } from "src/app/framework/constants/url-constants";
import { of } from 'rxjs';
import { socialEnterpriseData,personTypeData,supportedProgramData } from "./add-participant/dummy";

@Injectable({
  providedIn: 'root'
})
export class ParticipantV2Service {

  constructor(private readonly http: HttpClient) { }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/participant-v2/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  getFilteredSUList(sort: string, size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/user/filterUserList`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
    });
  }

  printCaseLoad(): any {
    const href = `${BaseUrl.USER}/export/caseLoad`;
    this.createAndSubmitForm(href);
  }

  createAndSubmitForm(url: string): void {
    const fd = document.createElement('form');
    fd.setAttribute('action', url);
    fd.setAttribute('method', 'POST');
    const inputElem = document.createElement('input');
    inputElem.setAttribute('name', 'access_token');
    inputElem.setAttribute('value', 'Bearer ' + localStorage.getItem('token'));
    fd.appendChild(inputElem);
    const holder = document.getElementById('form_holder');
    holder.appendChild(fd);
    fd.submit();
    holder.removeChild(fd);
  }

  updateLearners(payload) {
    const href = `${BaseUrl.USER}/participant-v2/update`;
    return this.http.put<any>(href, payload);
  }


  saveNewLearners(payload) {
    const href = `${BaseUrl.USER}/participant-v2/create`;
    return this.http.post<any>(href, payload);
  }

  getRefAnswer(): Observable<any> {
    const href = `${BaseUrl.USER}/ref-data/refAnswer`;
    return this.http.get<any>(href);
  }

  getUserRefDataDetails() {
    const href = `${BaseUrl.USER}/learner/refData`;
    return this.http.get<any>(href);
  }

  getUserDetails(id) {
    const href = `${BaseUrl.USER}/participant-v2/${id}`;
    return this.http.get<any>(href);
  }

  getRefDataForPersonSupported()
  {
    const href = `${BaseUrl.USER}/participant-v2/refData`;
    return this.http.get<any>(href);
  }

  getRefDataForPersonAndDesability() {
    const href = `${BaseUrl.USER}/ref-data-choice/all`;
    return this.http.get<any>(href).pipe(
      tap(data => {
       const jsonData= JSON.stringify(data)
       const encodedData = encodeURIComponent(jsonData)
        localStorage.setItem('refData', encodedData);
      })
    );
  }

  oneditAddOrEditPreviousQualificayion(payload) {
    const href = `${BaseUrl.USER}/participant-v2/previous-qualification`;
    return this.http.post<any>(href, payload);
  }
  oneditAddOrEditToWordsQualificayion(payload) {
    const href = `${BaseUrl.USER}/participant-v2/towards-qualification`;
    return this.http.post<any>(href, payload);
  }

  onDeletePreviousQualification(id) {
    const href = `${BaseUrl.USER}/participant-v2/previous-qualification/${id}`;
    return this.http.delete<any>(href);
  }

  onDeleteTowardsQualification(id) {
    const href = `${BaseUrl.USER}/participant-v2/towards-qualification/${id}`;
    return this.http.delete<any>(href);
  }
  get isLoggedIn() {
    return localStorage.getItem('token') ? true : false;
  }

  getRefDataForPlanV2() {
    const href = `${BaseUrl.PLAN}/ref-data-choice/all`;
    return this.http.get<any>(href).pipe(
      tap(data => {
       const jsonData= JSON.stringify(data)
       const encodedData = encodeURIComponent(jsonData)
        localStorage.setItem('refData_PlanV2', encodedData);
      })
    );
  }

  getSUAssignList(isSelfAssign, userId) {
    const href = `${BaseUrl.PLAN}/plan_goal_action_v2/action?isSelfAssign=${isSelfAssign}&serviceUserId=${userId}`;
    return this.http.get<any>(href)
  }
  getPersonTypeData(): Observable<any[]> {
  const href = `${BaseUrl.USER}/person-programme-contract`;
  return this.http.get<any>(href);
  }

  getKWAssignList() {
    const href = `${BaseUrl.PLAN}/plan_goal_action_v2/all-kw-assigned-action`;
    return this.http.get<any>(href)
  }
  getSupportedProgramData(personTypeIds: number[]): Observable<any[]> {
    return this.http.get<any[]>(`${BaseUrl.USER}/person-programme-contract/programme?personTypes=${personTypeIds}`)
  }
   
  getContractsData(programmeIds: number[]): Observable<any[]> {
    return this.http.get<any[]>(`${BaseUrl.USER}/person-programme-contract/contracts/?programmeids=${programmeIds}`)
  }

  getRefContrctList() {
    const href = `${BaseUrl.USER}/participant-v2/contracts`;
  return this.http.get<any>(href);
  }

}
