import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseUrl } from "src/app/framework/constants/url-constants";

@Injectable({
    providedIn: 'root'
  })
  export class ParticipantV4Service {
      
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

    getRefAnswer(): Observable<any> {
      const href = `${BaseUrl.USER}/ref-data/refAnswer`;
      return this.http.get<any>(href);
    }

    getUserRefDataDetails() {
      const href = `${BaseUrl.USER}/learner/refData`;
      return this.http.get<any>(href);
    }

    getRefDataAllDetails() {
      const href = `${BaseUrl.USER}/ref-data-choice/all`;
      return this.http.get<any>(href);
    }

    getUserDetails(id) {
      const href = `${BaseUrl.USER}/participant-v4/${id}`;
      return this.http.get<any>(href);
    }
   
    resolveLoggedInUserRole() {
      return JSON.parse(atob(localStorage.getItem('token').split('.')[1])).roleId;
    }
    
    saveNewLearners(payload) {
      const href = `${BaseUrl.USER}/participant-v4/create`;
      return this.http.post<any>(href, payload);
    }
    
    updateLearners(payload) {
      const href = `${BaseUrl.USER}/participant-v4/update`;
      return this.http.put<any>(href, payload);
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
    const href = `${BaseUrl.USER}/participantv4/furtherInformation`;
    return this.http.post<any>(href ,payload);
  }

  getFurtherInfo(id){
    const href = `${BaseUrl.USER}/participantv4/furtherInformation/${id}`;
    return this.http.get<any>(href);
  }


  updateFurtherInfo(payload){
    const href = `${BaseUrl.USER}/participantv4/furtherInformation`;
    return this.http.put<any>(href , payload);
  }

  printcaseNote(payload) {
    const href = (`${BaseUrl.USER}/user-case-note/print`);
    return this.http.post(href, payload,{responseType: 'blob',observe: 'response'});
 }

 getFurtherInfoRefData(){
  const href = `${BaseUrl.USER}/captrlearner/furtherInformation/refData`;
  return this.http.get<any>(href);
}


 oneditAddOrEditQualification(payload){
  const href = `${BaseUrl.USER}/participant-v4/qualification-create`;
      return this.http.post<any>(href, payload);
 }

 onDeleteQualification(id:any) {
  const href = `${BaseUrl.USER}/participant-v4/delete-qualification/${id}`;
  return this.http.delete<any>(href);
}
getReferralNote(id) : Observable<any>{
  const href = `${BaseUrl.USER}/participantv4/referralInfo/all/${id}`;
  return this.http.get<any>(href);
}

getReferralDropdownList() : Observable<any>{
  const href = `${BaseUrl.PLAN}/activity-refData/ref-intervention`;
  return this.http.get<any>(href);
}

getOrganisationDropdownList() : Observable<any>{
  const href = `${BaseUrl.PLAN}/activity-refData/ref-organisation`;
  return this.http.get<any>(href);
}

getRefOutcomeData() {
  const href = `${BaseUrl.USER}/ref-data/ref-outcome`;
  return this.http.get<any>(href); 
}

addReferral(payload) : Observable<any>{
  const href = `${BaseUrl.USER}/participantv4/referralInfo`;
  return this.http.post<any>(href, payload)
}

editReferral(id) : Observable<any> {
  const href = `${BaseUrl.USER}/participantv4/referralInfo/${id}`;
  return this.http.get<any>(href, id)
}

updateReferral(payload) {
  const href = `${BaseUrl.USER}/participantv4/referralInfo`;
  return this.http.put<any>(href, payload);
}

deleteReferral(id) : Observable<any>{
  const href = `${BaseUrl.USER}/participantv4/referralInfo/${id}`;
  return this.http.delete<any>(href)
}

printReferrals(payload) {
  const href = (`${BaseUrl.USER}/participantv4/referralInfo/print`);
  return this.http.post(href, payload,{responseType: 'blob',observe: 'response'});
}
}