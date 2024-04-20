import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Injectable()
export class RiskAssessmentService {

  constructor(private readonly http: HttpClient) { }

  saveRiskAssessment(payload) {
    const href = `${BaseUrl.USER}/risk-assessment/create`;
    return this.http.post<any>(href, payload);
  }

  updateRiskAssessment(payload) {
    const href = `${BaseUrl.USER}/risk-assessment/update`;
    return this.http.put<any>(href, payload);
  }

  fetchRiskAssessment(userId) {
    const href = `${BaseUrl.USER}/risk-assessment/get/${userId}`;
    return this.http.get<any>(href);
  }

  getRiskAssessmentHistory(userId) {
    const href = `${BaseUrl.USER}/risk-assessment/getAll/${userId}`;
    return this.http.get<any>(href);
  }

  getRefRiskAssessmentData() {
    const href = `${BaseUrl.USER}/ref-data/ref-risk-assessment`;
    return this.http.get<any>(href)
  }

}