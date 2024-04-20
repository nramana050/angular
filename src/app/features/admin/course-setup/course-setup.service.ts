import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class CourseSetupService {

  constructor(
    private readonly http: HttpClient
  ) { }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.COMPLY}/courses/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }
  updateCourse(payload) {
    const href = `${BaseUrl.COMPLY}/courses`
    return this.http.put<any>(href, payload);
  }
  createCourse(data) {
    const href = `${BaseUrl.COMPLY}/courses`
    return this.http.post<any>(href, data);
  }
  deleteCourse(id):Observable<any> {
    const href = `${BaseUrl.COMPLY}/courses/${id}`
    return this.http.delete(href)
  }
  getCourseDetails(id) {
    const href = `${BaseUrl.COMPLY}/courses/${id}`;
    return this.http.get(href);
  }
  getAllCourses() : Observable<any>{
    const href = `${BaseUrl.COMPLY}/courses`;
    return this.http.get(href);
  }
}
