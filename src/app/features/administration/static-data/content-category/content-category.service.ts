import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseUrl } from './../../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ContentCategoryService {

  constructor(private readonly http: HttpClient) { }

  getAllCategories(sort: string, size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/category/search`;
    return this.http.post<any>(href, body, {params: new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort.toString())
    });
  }

  getcreateMainCategories() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/category/refData`;
    return this.http.get<any>(href);
  }

  getcreateSubMainCategories() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/category/parents`;
    return this.http.get<any>(href);
  }

  createCategories(data) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/category/new`;
    return this.http.post<any>(href, data);
  }

  getFilterList(): Observable<any> {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/category/refData`;
    return this.http.get<any>(href);
  }

  getContentImageList(size: number, page: number, body: any){
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/contentImage/search`;
    return this.http.post<any>(href, body, {params: new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
     });
  }

  addImageToContent(id: number, imageId: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/contentImage/${id}/${imageId}`;
    return this.http.put<any>(href, imageId);
  }

  fetchCategory(id) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/category/${id}`;
    return this.http.get<any>(href);
  }

  updateCategory(id, body) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/category/${id}`;
    return this.http.put<any>(href, body);
  }

}
