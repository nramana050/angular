import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseUrl } from "src/app/framework/constants/url-constants";

@Injectable({
  providedIn: 'root'
})
export class RwsContentManagementService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  getContents(sort: string, size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
    });
  }

  deleteContent(body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/delete`;
    return this.http.request('delete', href, { body: body });
  }


  getDeleteReasonsRefData() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/refData/reasons`;
    return this.http.get<any>(href);
  }

  getAllAuthorList() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/authorDetails`;
    return this.http.get<any>(href);
  }

  getContentDetails(id: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/contentDetails/${id}`;
    return this.http.get<any>(href);
  }

  getContent(id: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/view/${id}`;
    return this.http.get<any>(href);
  }

  getLearningStyleList() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/refData/learningStyle`;
    return this.http.get<any>(href);
  }

  postNewContent(data: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/new`;
    return this.http.post<any>(href, data);
  }

  updateContentDescription(data: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/update`;
    return this.http.put<any>(href, data);
  }

  getRefData(){
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/ref-data-choice/all`;
    return this.http.get<any>(href);
  }
}