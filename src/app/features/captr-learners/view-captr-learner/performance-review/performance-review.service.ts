import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../../framework/constants/url-constants';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class PerformanceReviewService {

    constructor(
        private readonly http: HttpClient
    ) {
    }

    getAllAssessmentByUserAndAssessId(id?: any, assessId?: any): Observable<any> {
        return this.http.get<any>(`${BaseUrl.ASSESSMENT}/pr-assessment/getPerformanceAssessment/${id}/${assessId}`);
    }

    getPRAssessments(id?: any): Observable<any> {
        return this.http.get<any>(`${BaseUrl.ASSESSMENT}/getAssessment/${id}`);
    }

    setAssessmentTool(): boolean {
        if (BaseUrl.CLIENT_URL === "dev-staffmnprt.captr.online" || BaseUrl.CLIENT_URL === "test-staffmnprt.captr.online") {
            return true
        } else {
            return false
        }
    }

    fetchUserCurrentRole(): Observable<any> {
        return this.http.get<any>(`${BaseUrl.ASSESSMENT}/pr-assessment/role`);
    }

    fetchAspireRole(roleId:any): Observable<any> {
        return this.http.get<any>(`${BaseUrl.ASSESSMENT}/pr-assessment/role-mapping/${roleId}`);
    }

    getPeformanceReviewScore(assessmentTemplateUserId: number) {
        const href = `${BaseUrl.ASSESSMENT}/pr-assessment/comptencies-objectives/${assessmentTemplateUserId}`;
        return this.http.get<any>(href);
      }
}