import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class DigitalCourseProgressService {

  constructor(
    private readonly http: HttpClient
  ) { }

  getEnrolledCourses(payload) {
    const href = `${BaseUrl.MOODLE_API}/userCourses`;
    return this.http.post<any>(href, payload);
  }

  moodleLogin() {
    const href = `${BaseUrl.MOODLE_API}/login`;
    return this.http.get<any>(href);
  }
  
  unenrollUser(payload) {
    const href = `${BaseUrl.MOODLE_API}/digitalCourse/unenroll`;
    return this.http.post<any>(href, payload);
  }
}
