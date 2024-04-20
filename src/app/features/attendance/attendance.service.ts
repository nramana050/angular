import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(
    private readonly http: HttpClient
  ) { }

  getSessionsByDate(date: string, searchName?: string) {
    const href = `${BaseUrl.COMPLY}/attendance/sessions`;
    let params = new HttpParams();
    params = params.append('date', date);
    if(searchName) {
      params = params.append('keyword', searchName);
    }
    return this.http.get<any>(href, { params: params });
  }
  getAttendances(month?: any, year?: any) {
    const href = `${BaseUrl.COMPLY}/attendance/`;
    if (month !== undefined && year !== undefined) {
      let params = new HttpParams();
      if (month && year) {
        params = params.append('month', month);
        params = params.append('year', year);
      }
      return this.http.get<any>(href, { params: params });
    }
    return this.http.get<any>(href);
  }

  getLearnersForAttendance(data: any) {
    const href = `${BaseUrl.COMPLY}/attendance/learners`;
    return this.http.post(href,data);
  }

  saveAttendance(data):Observable<any> {
    const href = `${BaseUrl.COMPLY}/attendance`;
    return this.http.post(href,data);
  }

  getAttendanceRefData() {
    const href =  `${BaseUrl.COMPLY}/attendance/refData`;
    return this.http.get<any>(href);
  }
}
