import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private readonly reportType = 'FAB_DAILY_ASSESSMENT_RESPONSE_REPORT_V2';
  private readonly client = 'TVPCC';

  constructor(private readonly http: HttpClient) {
  }

  extractUsersLLIFdata(fileName: string) {
    const href = `${BaseUrl.USER}/report/user-llif/4`;
    return this.http.get<Blob>(href, { params: { 'fname': fileName }, observe: 'response', responseType: 'blob' as 'json' });
  }

  extractPlanLLIFdata(fileName: string, extractType: string) {
    const href = `${BaseUrl.PLAN}/extract-llif/report/` + extractType +'/1';
    return this.http.get<Blob>(href, { params: { 'fname': fileName }, observe: 'response', responseType: 'blob' as 'json' });
  }



  healthAndWellBeingReport(fileName: string, extractType: string) {
    const href = `${BaseUrl.REPORT}/report`;
    return this.http.get<Blob>(href, {
      params: {
        'client': this.client
        , 'report': this.reportType
        , 'name': fileName
      }, observe: 'response', responseType: 'blob' as 'json'
    });
  }
  extractUsersPeriodsOfEngagement(fileName: string) {
    const href = `${BaseUrl.USER}/report/user-periods-engagement/1`;
    return this.http.get<Blob>(href, { params: { 'fname': fileName }, observe: 'response', responseType: 'blob' as 'json' });
  }

  extractNdeliusAndVCData(fileName: string) {
    const href = `${BaseUrl.USER}/report/user-ndelius-vc/1`;
    return this.http.get<Blob>(href, { params: { 'fname': fileName }, observe: 'response', responseType: 'blob' as 'json' });
  }

  fabReport(fileName: string, clientIdentifier: string) {
    const href = `${BaseUrl.REPORT}/report`;
    return this.http.get<Blob>(href, {
      params: {
        'client': clientIdentifier
        , 'report': this.reportType
        , 'name': fileName
      }, observe: 'response', responseType: 'blob' as 'json'
    });
  }
}
