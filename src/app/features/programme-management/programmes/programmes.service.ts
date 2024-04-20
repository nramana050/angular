import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ProgrammesService {

  constructor(
    private readonly http: HttpClient
  ) { }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.COMPLY}/programme/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }
  updateProgramme(payload) {
    const href = `${BaseUrl.COMPLY}/programme`
    return this.http.put<any>(href, payload);
  }
  createProgramme(data) {
    const href = `${BaseUrl.COMPLY}/programme`
    return this.http.post<any>(href, data);
  }
  deleteProgramme(id): Observable<any> {
    const href = `${BaseUrl.COMPLY}/programme/${id}`
    return this.http.delete(href)
  }
  getProgrammeDetails(id): Observable<any> {
    const href = `${BaseUrl.COMPLY}/programme/${id}`;
    return this.http.get(href);
  }
  getAllprogramme(): Observable<any> {
    const href = `${BaseUrl.COMPLY}/programme`;
    return this.http.get(href);
  }
  
  getAllProgrammeCourses() : Observable<any> {
    const href = `${BaseUrl.COMPLY}/programme/allProgrammeCourses`;
    return this.http.get(href);
  }
}

