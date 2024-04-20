import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseUrl } from './../../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ContentKeywordsService {

  constructor(private readonly http: HttpClient) { }

  getAllKeywords(size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/keyword/search`;
    return this.http.post<any>(href, body, {params: new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      });
  }

  saveKeyword(data) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/keyword/new`;
    return this.http.post<any>(href, data);
  }

  deleteKeyword(body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/keyword/delete`;
    return this.http.request('delete', href, { body: body });
  }
}
