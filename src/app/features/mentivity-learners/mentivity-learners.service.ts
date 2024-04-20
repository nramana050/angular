import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseUrl } from "src/app/framework/constants/url-constants";

@Injectable({
    providedIn: 'root'
  })
  export class MentivityService {
      
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
      const href = `${BaseUrl.USER}/participant-v3/${id}`;
      return this.http.get<any>(href);
    }
  
    getUserRefDataDetails() {
      const href = `${BaseUrl.USER}/learner/refData`;
      return this.http.get<any>(href);
    }
  
    resolveLoggedInUserRole() {
      return JSON.parse(atob(localStorage.getItem('token').split('.')[1])).roleId;
    }
  
  
    getRefDataAllDetails() {
      const href = `${BaseUrl.USER}/ref-data-choice/all`;
      return this.http.get<any>(href);
    }
    
    saveNewLearners(payload) {
      const href = `${BaseUrl.USER}/participant-v3/create`;
      return this.http.post<any>(href, payload);
    }
    
    updateLearners(payload) {
      const href = `${BaseUrl.USER}/participant-v3/update`;
      return this.http.put<any>(href, payload);
    }

    getRefData() {
      const href = `${BaseUrl.COMPLY}/learnerEnrollments/getRefData`;
      return this.http.get<any>(href);
    }

  

  findAllCaseNotes(sort: string,size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/participant-v3-case-note/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
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

  getRefUserCategories() {
    const href =`${BaseUrl.USER}/ref-data/userCategories`;
    return this.http.get<any>(href);
  }

  getUserRefDataByCLientId(){
    const href =`${BaseUrl.USER}/participant-v2/refData`;
    return this.http.get<any>(href);
  }
  
  saveFurtherInfo(payload){
    const href = `${BaseUrl.USER}/participantv3/furtherInformation`;
    return this.http.post<any>(href ,payload);
  }

  getFurtherInfo(id){
    const href = `${BaseUrl.USER}/participantv3/furtherInformation/${id}`;
    return this.http.get<any>(href);
  }


  updateFurtherInfo(payload){
    const href = `${BaseUrl.USER}/participantv3/furtherInformation`;
    return this.http.put<any>(href , payload);
  }

  printcaseNote(payload) {
    const href = (`${BaseUrl.USER}/participant-v3-case-note/print`);
    return this.http.post(href, payload,{responseType: 'blob',observe: 'response'});
 }

 createUserCaseNote(payload){
  const href = `${BaseUrl.USER}/participant-v3-case-note`;
  return this.http.post<any>(href, payload);
}

getUserCaseNote(id:any){
  const href = `${BaseUrl.USER}/participant-v3-case-note/${id}`;
  return this.http.get<any>(href);
}

updateUserCaseNote(payload){
  const href = `${BaseUrl.USER}/participant-v3-case-note`;
  return this.http.put<any>(href, payload);
}

viewUserCaseNote(id: any) {
  const href = `${BaseUrl.USER}/participant-v3-case-note/view/${id}`;
  return this.http.get<any>(href);
}
deleteUserCaseNote(id:any) {
  const href = `${BaseUrl.USER}/participant-v3-case-note/${id}`;
  return this.http.delete<any>(href);
}
}