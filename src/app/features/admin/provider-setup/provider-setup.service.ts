import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ProviderSetupService {

  constructor(
    private readonly http: HttpClient
  ) { }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.COMPLY}/providers/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }
  updateProvider(payload) {
    const href = `${BaseUrl.COMPLY}/providers`
    return this.http.put<any>(href, payload);
  }
  createProvider(data) {
    const href = `${BaseUrl.COMPLY}/providers`
    return this.http.post<any>(href, data);
  }
  deleteProvider(id):Observable<any> {
    const href = `${BaseUrl.COMPLY}/providers/${id}`
    return this.http.delete(href)
  }
  getProviderDetails(id) {
    const href = `${BaseUrl.COMPLY}/providers/${id}`;
    return this.http.get(href);
  }
  getAllProviders()
  {
    const href = `${BaseUrl.COMPLY}/providers`;
    return this.http.get(href);
  }
}
