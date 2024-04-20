import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Injectable()
export class CompleteAssessmentsService {

  constructor(private readonly http: HttpClient) { }

  getAssessmentListByLoggedInUser(id?: any): Observable<any> {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/getAssessmentListByUser/${id}`);
  }

  getAssessments(id?: any): Observable<any> {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/getAssessment/${id}`);
  }

  getCompletedAssessment(id?: any,id1?: any): Observable<any>{
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/getCompletedAssessment/${id}/${id1}`); 
  }

  saveAssessmentResult(data: any) {
    const body = data;
    return this.http.post(`${BaseUrl.ASSESSMENT}/saveAssessmentResult`, body);
  }

  isCompletedAssessment(id: any): Observable<any> {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/isCompletedAssessment/${id}`);
  }

  deleteAssessment(id1: any,id2: any): Observable<any> {
    return this.http.delete<any>(`${BaseUrl.ASSESSMENT}/delete/${id1}/${id2}`);
  }

  getAssessmentDetailsByType(type) : Observable<any> {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/getAssessmentDetailsByType/${type}`);
  }

  getAssessmentResultByTemplateId(assessmentTemplateUserId,assessmentTemplateId) : Observable<any> {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/getAssessmentResultByTemplateId/${assessmentTemplateUserId}/${assessmentTemplateId}`);
  }

  getAssessmentByUserAndAssessId(id?: any, assId?:any): Observable<any> {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/getAssessmentListByUser/${id}/${assId}`);
  }

  getReviewListData(assId?:any): Observable<any> {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/review-details/${assId}`);
  }
}
