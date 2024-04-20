import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { FileUploadService } from 'src/app/features/shared/services/file-upload.service';
import { Observable } from 'rxjs';

@Injectable()
export class RiskAssessmentService {

  constructor(private readonly http: HttpClient,
    private readonly uploadService: FileUploadService
    ) { }

  saveRiskAssessment(formData: FormData, methodType: string) {
    const href = `${BaseUrl.USER}/risk-assessment-v2/createAssessment`;
    return this.uploadService.uploadFile(href, formData,methodType);
  }


  fetchRiskAssessment(serviceUserId) {
    const href = `${BaseUrl.USER}/risk-assessment-v2/get/${serviceUserId}`;
    return this.http.get<any>(href);
  }

  getRiskAssessmentHistory(userId) {
    const href = `${BaseUrl.USER}/risk-assessment-v2/getAll/${userId}`;
    return this.http.get<any>(href);
  }


  getRiskAssessmentdocumentHistory( page: number, size: number, userId: any): Observable<any> {
    const href = `${BaseUrl.USER}/risk-assessment-v2/getAll/document/${userId}`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('serviceUserId',userId)
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  getRefRiskAssessmentData() {
    const href = `${BaseUrl.USER}/ref-data/ref-risk-assessment`;
    return this.http.get<any>(href)
  }

}