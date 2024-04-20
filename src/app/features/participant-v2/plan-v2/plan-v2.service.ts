import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { BaseUrl } from "src/app/framework/constants/url-constants";

@Injectable({
  providedIn: 'root'
})
export class PlanV2Service {
  

  constructor(private readonly http: HttpClient) { }


  getassessments(userId,planType){
    const href = `${BaseUrl.ASSESSMENT}/ilp-vocation-plan/${userId}/${planType}`;
    return this.http.get<any>(href);
  }

  assignAssesment(selectedOption: any) {
    const href = `${BaseUrl.ASSESSMENT}/ilp-vocation-plan/assign`;
    return this.http.post<any>(href, selectedOption);
  }


  getAssessmentListByLoggedInUser(body: any, page: number, size: number): Observable<any> {
    const href = `${BaseUrl.ASSESSMENT}/ilp-vocation-plan/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }
  saveAssessmentResult(data: any) {
    const body = data;
    return this.http.post(`${BaseUrl.ASSESSMENT}/saveAssessmentResult`, body);
  }

  isCompletedAssessment(id: any): Observable<any> {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/isCompletedAssessment/${id}`);
  }


  getReviewType()
  {
    const href = `${BaseUrl.ASSESSMENT}/review-details`;
    return this.http.get<any>(href);
  }
  
  saveReview(payload)
  {
    const href = `${BaseUrl.ASSESSMENT}/review-details`;
    return this.http.post<any>(href,payload);
  }
  getFilterdAssessments(userId){
    const href = `${BaseUrl.ASSESSMENT}/ilp-vocation-plan/assessment-names/${userId}`;
    return this.http.get<any>(href);
  }

  deleteAssessment(id1: any,id2: any): Observable<any> {
    return this.http.delete<any>(`${BaseUrl.ASSESSMENT}/ilp-vocation-plan/delete/${id1}/${id2}`);
  }

  getAssessmentListByLoggedInUsers(id?: any): Observable<any> {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/getAssessmentListByUser/${id}`);
  } 

  addPlanGoalActionDetails(payload: any): Observable<any> {
    const href = `${BaseUrl.PLAN}/plan_goal_action_v2`;
    return this.http.post<any>(href, payload);
  }

  getGoalActionDetails(id: number, serviceUserId?: number): Observable<any> {
  
    const href = `${BaseUrl.PLAN}/plan_goal_action_v2/${id}`;  
    return this.http.get<any>(href);
  }

  updatePlanActionDetails(planDetails: any): Observable<any> {
    const href = `${BaseUrl.PLAN}/plan_goal_action_v2`;
    return this.http.put<any>(href, planDetails);
  }

  addgoalDetails(payload: any): Observable<any> {
    const href = `${BaseUrl.PLAN}/plan-goal-v2`;
    return this.http.post<any>(href, payload);
  }

  updatePlanGoalDetails(planDetails: any): Observable<any> {
    const href = `${BaseUrl.PLAN}/plan-goal-v2`;
    return this.http.put<any>(href, planDetails);
  }
  
  getGoalSAndActionByServiceUserId(id: any)
  {
    const href = `${BaseUrl.PLAN}/plan-goal-v2/all`;
    return this.http.get<any>(href,{params :new HttpParams().set('serviceUserId',id)});
  }

  getPlanGoalById(Id: number): Observable<any> {
    const url = `${BaseUrl.PLAN}/plan-goal-v2/${Id}`;
    return this.http.get<any>(url);
  }

  getGoalsActionByAssessmentTemplateUserId(asseTempUserId:any)
  {
    const href = `${BaseUrl.PLAN}/plan-goal-v2/goal-action/${asseTempUserId}`;
    return this.http.get<any>(href);
  }

  getFeedbackAssessments(assessmentTemplateId: any, assessmentTemplateUserId: any) {
    return this.http.get<any>(`${BaseUrl.ASSESSMENT}/ilp-vocation-plan/feedback/${assessmentTemplateId}/${assessmentTemplateUserId}`);
  }

  saveFeedBackAssessmentResult(data: any) {
    const body = data;
    return this.http.post(`${BaseUrl.ASSESSMENT}/ilp-vocation-plan/saveFeedBackResult`, body);
  }
  
  saveILPAssessmentResult(data: any) {
    const body = data;
    return this.http.post(`${BaseUrl.ASSESSMENT}/ilp-vocation-plan/saveAssessmentResult`, body);
  }

  getAllGoalsActionByAssessmentTemplateUserId(asseTempUserId:any)
  {
    const href = `${BaseUrl.PLAN}/plan-goal-v2/all-goals-action/${asseTempUserId}`;
    return this.http.get<any>(href);
  }

  getContractsForUser(serviceUserId: number): Observable<any> {
    const url = `${BaseUrl.USER}/participant-v2/contracts/${serviceUserId}`;
    return this.http.get<any>(url);
  }
}