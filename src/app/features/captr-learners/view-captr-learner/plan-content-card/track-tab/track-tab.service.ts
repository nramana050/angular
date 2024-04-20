import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from '../../../../../framework/constants/url-constants';

@Injectable()
export class TrackTabService {

  constructor(private readonly http: HttpClient) { }

  getActivityRefData() {
    const href = `${BaseUrl.PLAN}/activity-refData/captr`;
    return this.http.get<any>(href); 
  }

  getActivityRefDataOnly() {
    const href = `${BaseUrl.PLAN}/activity-refData/captrActivity`;
    return this.http.get<any>(href);
  }

  createIntervention(payload) {
    const href = `${BaseUrl.PLAN}/tvpcc/intervention`;
    return this.http.post<any>(href, payload);
  }

  createMeeting(payload) {
    const href = `${BaseUrl.PLAN}/meeting`;
    return this.http.post<any>(href, payload);
  }

  createComment(payload) {
    const href = `${BaseUrl.PLAN}/comment`;
    return this.http.post<any>(href, payload);
  }

  getUserList() {
    const href = `${BaseUrl.PLAN}/meeting/users`;
    return this.http.get<any>(href); 
  }

  getInterventionList(userId) {
    const href = `${BaseUrl.PLAN}/meeting/intervention/${userId}`;
    return this.http.get<any>(href); 
  }

  getSingleInterventionData(interventionId) {
    const href = `${BaseUrl.PLAN}/tvpcc/intervention/${interventionId}`;
    return this.http.get<any>(href); 
  }

  updateSingleIntervention(payload) {
    const href = `${BaseUrl.PLAN}/tvpcc/intervention`;
    return this.http.put<any>(href, payload);
  }

  getSingleAppointmentData(appointmentId) {
    const href = `${BaseUrl.PLAN}/meeting/${appointmentId}`;
    return this.http.get<any>(href); 
  }

  updateSingleMeeting(payload) {
    const href = `${BaseUrl.PLAN}/meeting`;
    return this.http.put<any>(href, payload);
  }

  deleteComment(commentId) {
    const href = `${BaseUrl.PLAN}/comment/${commentId}`;
    return this.http.delete<any>(href);
  }

  getRefIntOrganizationList(interventionId) {
    const href = `${BaseUrl.PLAN}/meeting/organisation/${interventionId}`;
    return this.http.get<any>(href); 
  }

  getInterventionData() {
    const href = `${BaseUrl.PLAN}/activity-refData/ref-intervention`;
    return this.http.get<any>(href);
  }

}
