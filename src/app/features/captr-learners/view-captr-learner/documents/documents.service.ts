import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { FileUploadService } from 'src/app/features/shared/services/file-upload.service';

@Injectable()
export class DocumentsService {

  constructor(
    private readonly http: HttpClient,
    private readonly uploadService: FileUploadService
  ) { }

  listOfDocuments(userId: number, size: number, page: number) {
    const href = `${BaseUrl.Document}/documents/users/${userId}`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  fetchDocument(docId: number) {
    const href = `${BaseUrl.Document}/documents/${docId}`;
    return this.http.get<any>(href);
  }

  upload(userId: number, formData: FormData, methodType: string) {
    const url = `${BaseUrl.Document}/documents/upload/users/${userId}`;
    return this.uploadService.uploadFile(url, formData,methodType);
  }

  deleteDocument(docId: number, reasonId: any) {
    const href = `${BaseUrl.Document}/documents/${docId}`;
    return this.http.delete<any>(href, {
      params: new HttpParams()
        .set('reasonId', reasonId)
    });
  }

  fetchDeleteReasons() {
    const href = `${BaseUrl.Document}/ref-data/reasons`;
    return this.http.get<any[]>(href);
  }

  download(id): any {
    const href = `${BaseUrl.Document}/download/documents/${id}`;
    this.createAndSubmitForm(href);
  }

  
  createAndSubmitForm(url: string): void {
    const fd = document.createElement('form');
    fd.setAttribute('action', url);
    fd.setAttribute('method', 'POST');
    const inputElem = document.createElement('input');
    inputElem.setAttribute('name', 'access_token');
    inputElem.setAttribute('value', 'Bearer ' + localStorage.getItem('token'));
    fd.appendChild(inputElem);
    const holder = document.getElementById('form_holder');
    holder.appendChild(fd);
    fd.submit();
    holder.removeChild(fd);
  }
  
  listOfProfessionalDocuments(userId: number, docType: string, size: number, page: number) {
    const href = `${BaseUrl.Document}/documents/users/${userId}`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('docType', docType)
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

}
