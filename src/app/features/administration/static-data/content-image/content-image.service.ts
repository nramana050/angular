import { FileUploadService } from './../../../shared/components/file-upload/file-upload.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../../../framework/constants/url-constants';


@Injectable({
  providedIn: 'root'
})
export class ContentImageService {

  constructor(
    private readonly http: HttpClient,
    private readonly fileService: FileUploadService
  ) { }

  getKeywordList() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/keyword/allActive?keywordType=Image`;
    return this.http.get<any>(href);
  }

  uploadData(data) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/uploadImage`;
    return this.fileService.uploadFileSynced(href, data);
  }

  getContentImageList(size: number, page: number, body: any) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/searchImageMetadata`;
    return this.http.post<any>(href, body, {params: new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
     });

  }

  getSelectedImage(contentId: number) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/getImageDetailsById/${contentId}`;
    return this.http.get<any>(href);
  }

  deleteImage(contentId) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/deleteImageMetadata/${contentId}`;
    return this.http.delete<any>(href);
  }

  getContentDetails(contentId) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/getImageDetailsById/${contentId}`;
    return this.http.get<any>(href);
  }

  updateImageMetaData(contentId, keywords) {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/updateImageMetadata/${contentId}`;
    return this.http.put<any>(href, keywords);
  }
}
