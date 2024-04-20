import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class DigitalCoursesService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  getCourseslist(payload) {
    const href = `${BaseUrl.MOODLE_API}/tps/courses`;
    return this.http.post<any>(href, payload);
  }

  moodleLogin() {
    const href = `${BaseUrl.MOODLE_API}/login`;
    return this.http.get<any>(href);
  }
  
  getUsersByCourse(courseId,enrolmentStatus){
    let params = new HttpParams()
    params=params.append('courseId', courseId);
    params=params.append('enrolmentStatus', enrolmentStatus);
    const href = `${BaseUrl.MOODLE_API}/getUsers`;
    return this.http.get<any>(href, {params : params});
  }

  enrollUsers(payload){
    const href = `${BaseUrl.MOODLE_API}/enrollUsers/enroll`;
    return this.http.post<any>(href, payload);
  }

  unenrollUsers(payload){
    const href = `${BaseUrl.MOODLE_API}/enrollUsers/unenroll`;
    return this.http.post<any>(href, payload);
  }
}
