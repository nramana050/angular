import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class QualificationSetupService {

  constructor(
    private readonly http: HttpClient
  ) { }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.COMPLY}/qualification/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }
  updateQualification(payload) {
    const href = `${BaseUrl.COMPLY}/qualification`
    return this.http.put<any>(href, payload);
  }
  createQualification(data) {
    const href = `${BaseUrl.COMPLY}/qualification`
    return this.http.post<any>(href, data);
  }
  deleteQualification(id):Observable<any> {
    const href = `${BaseUrl.COMPLY}/qualification/${id}`
    return this.http.delete(href)
  }
  getQualificationDetails(id) {
    const href = `${BaseUrl.COMPLY}/qualification/${id}`;
    return this.http.get(href);
  }
  getAllQualification()
  {
    const href = `${BaseUrl.COMPLY}/qualification`;
    return this.http.get(href);
  }
}
