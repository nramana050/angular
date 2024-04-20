import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from './../../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class PlanInductionService {

  sectionId = 57;
  constructor(private readonly http: HttpClient) { }

  getPlanInductionDetails(userId) {
    const href = `${BaseUrl.PLAN}/induction-Plan/details?planTypeIdentifier=1&userId=${userId}`;
    return this.http.get<any>(href);
  }

  getPlanInductionHistory(sectionIdentifier, userId) {
    const href = `${BaseUrl.PLAN}/induction-history?planTypeIdentifier=1&sectionIdentifier=${sectionIdentifier}&userId=${userId}`;
    return this.http.get<any>(href);
  }

  getQuestion(sectionIdentifier, userId) {
    const href = `${BaseUrl.PLAN}/captr/2/${sectionIdentifier}?userTypeId=2&userId=${userId}`;
    return this.http.get<any>(href)
  }

  getAnsweredQuestion(userId) {
    const href = `${BaseUrl.PLAN}/care-plan/2?userTypeId=2&userId=${userId}`;
    return this.http.get<any>(href)
  }

  getRefData() {
    const href = `${BaseUrl.PLAN}/induction-plan-refData/refData`;
    return this.http.get<any>(href)
  }

  resolveQuestionType(identifier, refData) {
    const filteredQuestionTypeArr = refData.questionTypeList.filter(type => type.identifier === identifier.toString());
    return filteredQuestionTypeArr[0].planTypeDescription;
  }

  resolveQuestionAnswersLabels(identifier, refData) {
    const filteredDomainListArr = refData.domainList.filter(domain => domain.identifier === identifier.toString());
    const choiceList = filteredDomainListArr[0].choiceList;
    const answersLabelsArr = [];
    choiceList.forEach(choice => answersLabelsArr.push(choice.choiceDescription));
    return answersLabelsArr;
  }

  resolveQuestionAnswersValues(identifier, refData) {
    const filteredDomainListArr = refData.domainList.filter(domain => domain.identifier === identifier.toString());
    const choiceList = filteredDomainListArr[0].choiceList;
    const answersValuesArr = [];
    choiceList.forEach(choice => answersValuesArr.push(choice.choiceId.toString()));
    return answersValuesArr;
  }

  getActionPlanGoalList(userId) {
    const href = `${BaseUrl.PLAN}/action-plan/all/2?status=Active&serviceUserId=${userId}`;
    return this.http.get<any>(href)
  }

  addGoal(payload, userId) {
    const href = `${BaseUrl.PLAN}/action-plan?serviceUserId=${userId}`;
    return this.http.post<any>(href, payload);
  }

  getGoalDetails(goalId,userId) {
    const href = `${BaseUrl.PLAN}/action-plan/${goalId}?serviceUserId=${userId}`;
    return this.http.get<any>(href)
  }

  updateGoal(payload, userId) {
    const href = `${BaseUrl.PLAN}/action-plan?serviceUserId=${userId}`;
    return this.http.put<any>(href, payload);
  }

  saveActionPlan(payload) {
    const href = `${BaseUrl.PLAN}/care-plan`;
    return this.http.post<any>(href, payload);
  }

  checkCarePlanStatus(serviceUserId, planTypeIdentifier) {
    const href = `${BaseUrl.PLAN}/care-plan/carePlanStatus/${serviceUserId}/${planTypeIdentifier}`;
    return this.http.get<any>(href)
  }

  getHistoryVersions(suId: any) {
    const href = `${BaseUrl.PLAN}/action-plan/version/${suId}/2`;
    return this.http.get<any>(href);
  }

  getUserActionPlan(serviceUserId){
    const href = `${BaseUrl.PLAN}/captr/checkAns/2?serviceUserId=${serviceUserId}&sectionId=${this.sectionId}`;
    return this.http.get<any>(href);
  }

  getPlanChanged(serviceUserId) {
    const href = `${BaseUrl.PLAN}/care-plan/changed/${serviceUserId}/2`;
    return this.http.get<Boolean>(href);
  }

  createPlan(data) {
    const href = `${BaseUrl.PLAN}/care-plan/createPlan`;
    return this.http.post<any>(href, data)
  }
  
  addAction(payload){
    const href = `${BaseUrl.PLAN}/goal-action`;
    return this.http.post<any>(href, payload)
  }

  getActionDetails(goalActionId,userId) {
    const href = `${BaseUrl.PLAN}/goal-action/${goalActionId}?serviceUserId=${userId}`;
    return this.http.get<any>(href)
  }

  updateAction(payload) {
    const href = `${BaseUrl.PLAN}/goal-action`;
    return this.http.put<any>(href, payload);
  }

  getRefActionChoices() {
    const href = `${BaseUrl.PLAN}/goal-action/ref-action`;
    return this.http.get<any>(href);
  }

  AddReminderForAction(actionPayload: any) {
    const href = `${BaseUrl.PLAN}/meeting/reminder`
    return this.http.post<any>(href, actionPayload, { observe: 'response' });
  }

  getQuestionForDashboard(sectionIdentifier) {
    const href = `${BaseUrl.PLAN}/captr/dashboard/2/${sectionIdentifier}?userTypeId=2`;
    return this.http.get<any>(href)
  }
}
