import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class LearnersService {

  constructor(private readonly http: HttpClient) { }
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
    const href = `${BaseUrl.USER}/learner/${id}`;
    return this.http.get<any>(href);
  }

  getUserRefDataDetails() {
    const href = `${BaseUrl.USER}/learner/refData`;
    return this.http.get<any>(href);
  }

  resolveLoggedInUserRole() {
    return JSON.parse(atob(localStorage.getItem('token').split('.')[1])).roleId;
  }

  getRefAnswer(): Observable<any> {
    const href = `${BaseUrl.USER}/ref-data/refAnswer`;
    return this.http.get<any>(href);
  }

  saveNewLearners(payload) {
    const href = `${BaseUrl.USER}/learner`;
    return this.http.post<any>(href, payload);
  }

  saveEnrolment(payload) {
    const href = `${BaseUrl.COMPLY}/learnerEnrollments/withdrawLearner`;
    return this.http.post<any>(href, payload);
  }

  updateEnrolment(payload) {
    const href = `${BaseUrl.COMPLY}/learnerEnrollments/withdrawLearner`;
    return this.http.post<any>(href, payload);
  }

  getLastAttendedDate(did, id) {
    const href = `${BaseUrl.COMPLY}/learnerEnrollments/getLastAttendanceDate`;
    let params = new HttpParams();
    params = params.append('programmeDeliveryId', did);
    params = params.append('learnerId', id);
    return this.http.get<any>(href, { params: params });
  }

  updateLearners(payload) {
    const href = `${BaseUrl.USER}/learner`;
    return this.http.put<any>(href, payload);
  }

  getEnrolmentDetails(id) {
    const href = `${BaseUrl.COMPLY}/programme/delivery/learnerEnrollmentList/${id}`;
    return this.http.get<any>(href);
  }

  getLearnerEnrolmentDetails(id, did) {
    const href = `${BaseUrl.COMPLY}/learnerEnrollments/getLearnerCourses`;
    let params = new HttpParams();
    params = params.append('learnerId', id);
    params = params.append('programDeliveryId', did);
    return this.http.get<any>(href, { params: params });
  }

  getRefData() {
    const href = `${BaseUrl.COMPLY}/learnerEnrollments/getRefData`;
    return this.http.get<any>(href);
  }
  getCVDetails(uid) {
    const href = `${BaseUrl.CVB}/cvs/${uid}`;
    return this.http.get<any>(href);
  }
  download(id): any {
    const href = `${BaseUrl.CVB}/download/cvs/${id}`;
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
  getGoals(userId) {
    const href = `${BaseUrl.PLAN}/induction-Plan/goals/1?userId=${userId}`;
    return this.http.get<any>(href);
  }

  getFstructureData(userId, pageNumber) {
    const href = `${BaseUrl.PLAN}/fstructure?sort=sortDate,desc&sort=activityId,asc&page=${pageNumber}&size=15&userId=${userId}`;
    return this.http.get<any>(href);
  }

  getFstructureComments(userId, pageNumber, sortDateField?: string) {
    const sortDate = sortDateField == undefined ?  "sortDate" : sortDateField;
    const href = `${BaseUrl.PLAN}/fstructure/comments?userId=${userId}&sort=${sortDate},desc&page=${pageNumber}&size=15`;
    return this.http.get<any>(href);
  }

  getSchedulerData(userId) {
    const href = `${BaseUrl.PLAN}/schedule?userId=${userId}`;
    return this.http.get<any>(href);
  }

  getJobDetails(id: string) {
    const href = `${BaseUrl.JOBS}/jobs/${id}`;
    return this.http.get<any>(href);
  }
  getLocalJobs(suid, page, size, sort) {
    const href = `${BaseUrl.JOBS}/express-interest/nfn/${suid}`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
    });
  }
  getJobApplications(suid, page, size, sort) {
    const href = `${BaseUrl.JOBS}/applications/service-users/${suid}`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
    });
  }
  getServiceUserDetails(id: number) {
    const href = `${BaseUrl.USER}/serviceUser/get/${id}`;
    return this.http.get<any>(href);
  }

  getFavJobList(suid, page, size, sort) {
    const href = `${BaseUrl.JOBS}/job-user/favourites/${suid}`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
    });

  }

  SaveUserStatus(messageJson: any) {
    const href = `${BaseUrl.USER}/user-status`;
    return this.http.post<any>(href, messageJson);
  }
  
  viewVCInfo(prn: string) {
    const href = `${BaseUrl.USER}/vcinfo/${prn}`;
    return this.http.get<any>(href)
  }

  getKwList(identifier): Observable<any> {
    const href = `${BaseUrl.USER}/user/users-by-identifier`;
    return this.http.get<any>(href,{
      params: new HttpParams()
      .set('identifiers',identifier)
    });
  }

  updateUserCaseNote(payload){
    const href = `${BaseUrl.USER}/user-case-note`;
    return this.http.put<any>(href, payload);
  }

  createUserCaseNote(payload){
    const href = `${BaseUrl.USER}/user-case-note`;
    return this.http.post<any>(href, payload);
  }

  getUserCaseNote(id:any){
    const href = `${BaseUrl.USER}/user-case-note/${id}`;
    return this.http.get<any>(href);
  }

  deleteLearner(id:any):Observable<any>{
    const href = `${BaseUrl.USER}/learner/${id}`;
    return this.http.delete<any>(href);
  }

}

