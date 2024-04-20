import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  constructor(
    private readonly http: HttpClient,
    ) { }

  getReferralNote(id) : Observable<any>{
    const href = `${BaseUrl.USER}/referral-notes/all/${id}`;
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
    const href = `${BaseUrl.USER}/referral-notes`;
    return this.http.post<any>(href, payload)
  }

  editReferral(id) : Observable<any> {
    const href = `${BaseUrl.USER}/referral-notes/${id}`;
    return this.http.get<any>(href, id)
  }

  updateReferral(payload) {
    const href = `${BaseUrl.USER}/referral-notes`;
    return this.http.put<any>(href, payload);
  }

  deleteReferral(id) : Observable<any>{
    const href = `${BaseUrl.USER}/referral-notes/${id}`;
    return this.http.delete<any>(href)
  }

  printReferrals(payload) {
    const href = (`${BaseUrl.USER}/referral-notes/print`);
    return this.http.post(href, payload,{responseType: 'blob',observe: 'response'});
  }
}
