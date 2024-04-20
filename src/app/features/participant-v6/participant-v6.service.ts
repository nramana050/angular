import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseUrl } from "../../framework/constants/url-constants";

@Injectable({
    providedIn: 'root'
  })
  export class ParticipantV6Service {

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
    
      getRefAnswer(): Observable<any> {
        const href = `${BaseUrl.USER}/ref-data/refAnswer`;
        return this.http.get<any>(href);
      }

      getUserRefDataDetails() {
        const href = `${BaseUrl.USER}/learner/refData`;
        return this.http.get<any>(href);
      }

      getUserDetails(id) {
        const href = `${BaseUrl.USER}/participant-v6/${id}`;
        return this.http.get<any>(href);
      }

      saveNewLearners(payload) {
        const href = `${BaseUrl.USER}/participant-v6/create`;
        return this.http.post<any>(href, payload);
      }

      updateLearners(payload) {
        const href = `${BaseUrl.USER}/participant-v6/update`;
        return this.http.put<any>(href, payload);
      }
  
      getAllocatedRefData(){
        const href = `${BaseUrl.USER}/participant-v6/organizations`;
        return this.http.get<any>(href);
      }

      resolveLoggedInUserRole() {
        return JSON.parse(atob(localStorage.getItem('token').split('.')[1])).roleId;
      }

      getRefDataAllDetails() {
        const href = `${BaseUrl.USER}/ref-data-choice/all`;
        return this.http.get<any>(href);
      }
    
  }

