import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseUrl } from "../../framework/constants/url-constants";
import { FileUploadService } from "../../features/upload-csv/file-upload.service";


@Injectable()
export class UploadCsvService {

  constructor(
    private readonly http: HttpClient,
    private readonly uploadService: FileUploadService
  ) { }

  uploadCSV(formData: FormData, methodType: string) {
    const url = `${BaseUrl.USER}/csv/upload`;
    return this.uploadService.uploadFile(url, formData,methodType);
  }

  getAllCSV(sort: string, size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.USER}/ndelius/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
    });
  }

  refreshCSV(id: any) {
    const href = `${BaseUrl.USER}/ndelius/refresh/${id}`;
    return this.http.get<any>(href);
  }

  // getCSVDetails(id: any) {
  //   const href = `${BaseUrl.USER}/ndelius/${id}`;
  //   return this.http.get<any>(href);
  // }

}