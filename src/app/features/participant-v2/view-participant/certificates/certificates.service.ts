import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { FileUploadService } from 'src/app/features/shared/services/file-upload.service';

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {

  constructor(private readonly http: HttpClient,
    private readonly uploadService: FileUploadService
  ) { }

  getCertificateslist(payload) {
    const href = `${BaseUrl.MOODLE_API}/tps/kw/certificates`;
    return this.http.post<any>(href, payload);
  }

  listOfCertificates(userId, pageIndex: number, pageSize: number) {
    const payload = { "page": pageIndex, "pagesize": pageSize, "sort": "sortorder", "serviceUserId": userId }
    const href = `${BaseUrl.MOODLE_API}/tps/kw/certificates`;
    return this.http.post<any>(href, payload);
  }
  downloadCourseCertificate(payload) {
    const href = `${BaseUrl.MOODLE_API}/download/certificates`;
    return this.http.post(href, payload, { responseType: 'blob', observe: 'response' });
  }


  uploadDocument(id: number, data: any, method: 'POST' | 'PUT') {
    const href = `${BaseUrl.Document}/documents/upload/users/${id}`;
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('documentId', data.id);
    formData.append('description', 'data.description');
    formData.append('fileName', data.fileName);
    formData.append('docType', 'CERTIFICATES')
    formData.append('dateAchieved', data.achievedDate)
    return this.uploadService.uploadFile(href, formData, method);
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


}
