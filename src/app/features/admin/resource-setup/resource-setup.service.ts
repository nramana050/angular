import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ResourceSetupService {

  constructor(
    private readonly http: HttpClient
  ) { }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.COMPLY}/resources/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }
  updateResource(payload) {
    const href = `${BaseUrl.COMPLY}/resources`
    return this.http.put<any>(href, payload);
  }
  createResource(data) {
    const href = `${BaseUrl.COMPLY}/resources`
    return this.http.post<any>(href, data);
  }
  deleteResource(id):Observable<any>
  {
    const href=`${BaseUrl.COMPLY}/resources/${id}`
    return this.http.delete(href)
  }
  getResourceDetails(id)
  {
    const href = `${BaseUrl.COMPLY}/resources/${id}`;
    return this.http.get(href);
  }
}
