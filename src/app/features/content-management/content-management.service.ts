import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from './../../framework/constants/url-constants';
import { Observable, of } from 'rxjs';
import { FileUploadService } from '../shared/components/file-upload/file-upload.service';

@Injectable({
  providedIn: 'root'
})
export class ContentManagementService {

  constructor(
    private readonly http: HttpClient,
    private readonly uploadService: FileUploadService
  ) { }

  getLearningStyleList() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/refData/learningStyle`;
    return this.http.get<any>(href);
  }

  getAllAuthorList() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/authorDetails`;
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

  getContents(sort: string, size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
    });
  }

  getContentDetails(id: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/contentDetails/${id}`;
    return this.http.get<any>(href);
  }

  getAllOrganizations(): Observable<any> {
    const href = `${BaseUrl.USER}/user/getAllOrganizationsAndFilter`;
    return this.http.get<any>(href);
  }

  getSelectedOrganizations(id: number): Observable<any> {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content-organization/${id}`;
    return this.http.get<any>(href);
  }

  saveContentOrganizations(content: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content-organization/create`;
    return this.http.put<any>(href, content);
  }

  getMainCategories() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/category/parents`;
    return this.http.get(href);
  }

  getSubcategory(id: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/category/${id}/subcategory`;
    return this.http.get(href);
  }

  getContentKeywords(contentId: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/contentKeywords/${contentId}`;
    return this.http.get<any>(href);
  }

  getContentKeywordOptions(page: number, size: number, body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/searchKeyword`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  saveContentKeywordsAndCategory(payload) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/contentKeyword`;
    return this.http.put<any>(href, payload);
  }

  getContentImageList(size: number, page: number, body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/contentImage/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });

  }

  getSelectedImage(contentId: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/contentImage/${contentId}`;
    return this.http.get<any>(href);
  }

  addImageToContent(id: number, imageId: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/contentImage/${id}/${imageId}`;
    return this.http.put<any>(href, imageId);
  }

  getContentModules(id: number, page: number, size: number, body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/searchModule/${id}`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  getContentModule(id: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/module/${id}`;
    return this.http.get<any>(href);
  }

  createModule(body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/module`;
    return this.http.post<any>(href, body);
  }

  editModule(body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/updateModule`;
    return this.http.put<any>(href, body);
  }

  upload(file: File, moduleId: number) {
    const url = `${BaseUrl.CONTENT_MANAGEMENT}/uploadFile/${moduleId}`;
    const formData = new FormData();
    formData.append('file', file);
    return this.uploadService.uploadFile(url, formData,'POST');
  }

  refreshUploadStatus(id: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/uploadStatus/${id}`;
    return this.http.get<any>(href);
  }

  updateSequence(id: number, payload: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/changeSequence/${id}`;
    return this.http.put<any>(href, payload);
  }

  getDeleteReasonsRefData() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/refData/reasons`;
    return this.http.get<any>(href);
  }

  deleteContent(body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/delete`;
    return this.http.request('delete', href, { body: body });
  }

  deleteModule(body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/deleteModule`;
    return this.http.request('delete', href, { body: body });
  }

  getContent(id: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/content/view/${id}`;
    return this.http.get<any>(href);
  }
  getClient() {
    const href = `${BaseUrl.USER}/notification/client`;
    return this.http.get<any>(href);
  }

}
