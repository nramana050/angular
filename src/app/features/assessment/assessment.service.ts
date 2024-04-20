import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../framework/constants/url-constants';
import { IAssessmentTemplate } from './assessment.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SchemaDefinition } from './schemaDefinition.model';

@Injectable()
export class AssessmentService {

  constructor(private readonly http: HttpClient) {

  }

  
  getAssessmentsTable(): Observable<IAssessmentTemplate[]> {
    return this.http.get<IAssessmentTemplate[]>(`${BaseUrl.ASSESSMENT}/getAllAssessment`)
      .pipe(
        map((data: IAssessmentTemplate[]) =>
          data = data.map(item => ({
            assessmentTemplateId: item.assessmentTemplateId,
            assessmentName: item.assessmentName,
            createdBy: item.createdBy,
            createdDate: item.createdDate,
            isActive: item.isActive,
            isPublished: item.isPublished,
            status: this.setStatus(item.isActive, item.isPublished)
          }))));
  }

  setStatus(isActive, isPublished) {

    if (isPublished && isActive) {
      return 'Published';
    }
    if (!isPublished && isActive) {
      return 'Active';
    }
      return 'Inactive';
  }
  getAssessments(sort: string, size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.ASSESSMENT}/captr/search`;
    return this.http.post<any>(href, body, {
       params: new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sort.toString())
    });
 }
  getAssessment(id: any): Observable<IAssessmentTemplate> {
    return this.http.get<IAssessmentTemplate>(`${BaseUrl.ASSESSMENT}/getAssessment/${id}`);
  }

  isCompletedAssessment(id: any): Observable<IAssessmentTemplate> {
    return this.http.get<IAssessmentTemplate>(`${BaseUrl.ASSESSMENT}/isCompletedAssessment/${id}`);
  }

  createAssessment(createAssessmentData: any) {
    const body = createAssessmentData;
    return this.http.post(`${BaseUrl.ASSESSMENT}/createAssessment`, body);
  }

  publishedAssessment(publishedAssessmentData: any) {
    const body = publishedAssessmentData;
    return this.http.post(`${BaseUrl.ASSESSMENT}/publishedAssessment`, body);
  }

  publishedAssessmentToAll(assessmentTemplateId: any) {
    return this.http.post(`${BaseUrl.ASSESSMENT}/publishAssessmentForOrg/${assessmentTemplateId}`, {});
  }

  getServiceUsers(identifier): Observable<any>{
    const href = `${BaseUrl.USER}/serviceUser/${identifier}`;
    return this.http.get<any>(href);
  }

  activeAndInactiveAssessment(data: any) {
    const body = data;
    return this.http.post(`${BaseUrl.ASSESSMENT}/activeAndInactiveAssessment`, body);
  }

  fetchConfiguredAssessmentList(){
    return this.http.get<IAssessmentTemplate>(`${BaseUrl.PLAN}/plan/templateNames`);
  }
  enableAndDisableAssessment(data: any) {
    const body = data;
    return this.http.post(`${BaseUrl.ASSESSMENT}/enableAndDisableAssessment`, body);
  }

  getAssessmentTemplateAnswersById(templateId:any){
   return this.http.get<any>(`${BaseUrl.ASSESSMENT}/getAssessmentTemplateAnswers/${templateId}`);
  }

  getSchemaDefinitions(): Observable<SchemaDefinition[]> {
    const href = `${BaseUrl.ASSESSMENT}/schema-definition/list`;
    return this.http.get<any>(href);
  }
}
