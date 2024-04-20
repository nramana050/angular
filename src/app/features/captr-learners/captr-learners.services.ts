import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseUrl } from "src/app/framework/constants/url-constants";



@Injectable({
    providedIn: 'root'
  })
  export class CaptrLearnersService {
  
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
  
    getFilteredSUList(sort: string, size: number, page: number, body: any): Observable<any> {
      const href = `${BaseUrl.USER}/user/filterUserList`;
      return this.http.post<any>(href, body, {
        params: new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sort.toString())
      });
    }
    getUserDetails(id) {
      const href = `${BaseUrl.USER}/captrlearner/${id}`;
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
      const href = `${BaseUrl.USER}/captrlearner/create`;
      return this.http.post<any>(href, payload);
    }
  
    saveEnrolment(payload) {
      const href = `${BaseUrl.COMPLY}/learnerEnrollments/withdrawLearner`;
      return this.http.post<any>(href, payload);
    }
  
    updateEnrolment(payload){
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
      const href = `${BaseUrl.USER}/captrlearner/update`;
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

    getFurtherInfo(id){
      const href = `${BaseUrl.USER}/captrlearner/furtherInformation/${id}`;
      return this.http.get<any>(href);
    }


    saveFurtherInfo(payload){
      const href = `${BaseUrl.USER}/captrlearner/furtherInformation/create`;
      return this.http.post<any>(href ,payload);
    }

    updateFurtherInfo(payload){
      const href = `${BaseUrl.USER}/captrlearner/furtherInformation/update`;
      return this.http.put<any>(href , payload);
    }

    getFurtherInfoRefData(){
      const href = `${BaseUrl.USER}/captrlearner/furtherInformation/refData`;
      return this.http.get<any>(href);
    }
  

  viewUserCaseNote(id: any) {
    const href = `${BaseUrl.USER}/user-case-note/view/${id}`;
    return this.http.get<any>(href);
  }

  findAllCaseNotes(sort: string,size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/user-case-note/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
    });
  }

  deleteUserCaseNote(id:any) {
    const href = `${BaseUrl.USER}/user-case-note/${id}`;
    return this.http.delete<any>(href);
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

  getSUAssignList(isSelfAssign, userId) {
    const href = `${BaseUrl.PLAN}/goal-action/action?isSelfAssign=${isSelfAssign}&serviceUserId=${userId}`;
    return this.http.get<any>(href)
  }
  findAllUsefulContact(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/usefulContact/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }


  getUsefulContactDetails(id) {
    const href = `${BaseUrl.USER}/usefulContact/${id}`;
    return this.http.get<any>(href);
  }

  updateUsefulContactDetails(payload) {
    const href =`${BaseUrl.USER}/usefulContact/update`;
    return this.http.put(href, payload);
  }

  createUsefulContactDetails(payload) {
    const href =`${BaseUrl.USER}/usefulContact/create`;
    return this.http.post(href, payload);

  }

  deleteUsefulContact(id:any) {
    const href =`${BaseUrl.USER}/usefulContact/deleteContact/${id}`;
    return this.http.delete<any>(href);
  }
  
  printcaseNote(payload) {
    const href = (`${BaseUrl.USER}/user-case-note/print`);
    return this.http.post(href, payload,{responseType: 'blob',observe: 'response'});
  }


  getRefUserCategories() {
    const href =`${BaseUrl.USER}/ref-data/userCategories`;
    return this.http.get<any>(href);
  }

  getKWAssignList() {
    const href = `${BaseUrl.PLAN}/goal-action/all-Kw-assigned-action`;
    return this.http.get<any>(href)
  }
}

