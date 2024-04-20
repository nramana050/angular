import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class CaseloadOverviewService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  personalisePinUnpin(payload) {
    const href = `${BaseUrl.USER}/Caseload/personalise`;
    return this.http.post<any>(href, payload);
  }

  personalise() {
    const href = `${BaseUrl.USER}/Caseload`;
    return this.http.get<any>(href);
  }

  personaliseRefData() {
    const href = `${BaseUrl.USER}/Caseload/refData`;
    return this.http.get<any>(href);
  }

  getFilteredSUList(size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/Caseload/filterUserList`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  getUserRecentlyViewedList(size: number, page: number, body: any) : Observable<any> {
    const href = `${BaseUrl.USER}/Caseload/userRecentlyViewedList`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }
s
  getUpcomingTask(size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/Caseload/upcomingRiskAssesment`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  getOutstandingTask(size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/Caseload/outstandingRiskAssesment`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  exportCsv(): Observable<Blob> {
    return this.http.get(`${BaseUrl.USER}/Caseload/export`, { responseType: 'blob' });
  }

}


