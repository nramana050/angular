import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utility } from 'src/app/framework/utils/utility';
import { BaseUrl } from '../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeDeliveryService {

  constructor(
    private readonly http: HttpClient
  ) { }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.COMPLY}/programme/delivery/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  createProgrammeDelivery(payload) {
    payload.programmeCourseDelivery.forEach(course => {
      course.startDate = Utility.dateToString(course.startDate);
      course.endDate = Utility.dateToString(course.endDate);
    });
    const href = `${BaseUrl.COMPLY}/programme/delivery`
    return this.http.post<any>(href, payload);
  }

  updateProgrammeDelivery(payload) {
    payload.programmeCourseDelivery.forEach(course => {
      course.startDate = Utility.dateToString(course.startDate);
      course.endDate = Utility.dateToString(course.endDate);
    });
    const href = `${BaseUrl.COMPLY}/updateDelivery`
    return this.http.put<any>(href, payload);
  }

  getEnrolledLearners(startDateToString,endDateToString, programmeDeliveryId?): Observable<any> {
    const href = `${BaseUrl.COMPLY}/programme/delivery/enrolledLearners`;
    const headers = new HttpHeaders();
    let par : HttpParams = new HttpParams()
    .set('endDate', endDateToString)
    .set('startDate', startDateToString)
    if(programmeDeliveryId){
     par = par.set('programmeDeliveryId', programmeDeliveryId)
    }
    const options = { headers: headers, params: par };
    return this.http.get<any>(href, options)
   }

  getProgrammeDeliveryDetails(id): Observable<any> {
    const href = `${BaseUrl.COMPLY}/programme/delivery/${id}`;
    return this.http.get<any>(href);
  }

  getLearnerCourseAttendenceList(id): Observable<any> {
    const href = `${BaseUrl.COMPLY}/updateDelivery/learnerAttendanceList/${id}`;
    return this.http.get<any>(href);
  }

  getProgressAndCompletionLearners(id):Observable<any>{
    const href = `${BaseUrl.COMPLY}/progressCompletion/getAllLearners`;
    const headers = new HttpHeaders();
    let par : HttpParams = new HttpParams()
    .set('programmeDeliveryId', id)
    const options = { headers: headers, params: par };
    return this.http.get<any>(href, options)
   }

  getProgressAndCompletionData(id): Observable<any> {
    const href = `${BaseUrl.COMPLY}/progressCompletion/${id}`;
    return this.http.get<any>(href);
  }

  getWithdrawalLearnersData(id): Observable<any> {
    const href = `${BaseUrl.COMPLY}/learnerEnrollments/getWithdrawnLearners`;
    const headers = new HttpHeaders();
    let par: HttpParams = new HttpParams()
      .set('programmeDeliveryId', id)
    const options = { headers: headers, params: par };
    return this.http.get<any>(href, options)
  }

  saveProgressAndCompletionData(payload): Observable<any> {
    const href = `${BaseUrl.COMPLY}/progressCompletion/saveProgressCompletion`;
    return this.http.post<any>(href, payload);
  }

  deleteProgramDelivery(id):Observable<any> {
    const href = `${BaseUrl.COMPLY}/programme/delivery/${id}`
    return this.http.delete(href)
  }
}
