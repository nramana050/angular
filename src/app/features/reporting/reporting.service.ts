import { Injectable } from '@angular/core';
import { BaseUrl } from '../../framework/constants/url-constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getSamplePowerBiTokens(reportName) {
    const href = `${BaseUrl.REPORTS_BI}&reportName=${reportName}`;
    return this.httpClient.get(href);
  }

  getPowerBiTokens(templateName) {
    const href = `${BaseUrl.POWERBI}/embed/report?templateName=${templateName}`;
    return this.httpClient.get(href);
  }

}
