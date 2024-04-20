import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseUrl } from '../../framework/constants/url-constants';
import { FileUploadService } from '../shared/services/file-upload.service';
import { ICustomer } from './customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private readonly http: HttpClient,
    private readonly fileUploadService:FileUploadService)
  { }

  uploadLogo(formData){
    const href =`${BaseUrl.USER}/clients/fileUpload`;
    return this.fileUploadService.uploadFile(href, formData , 'POST');
  }

  creatNewCustomer(data) {
    const href =`${BaseUrl.USER}/clients`
    return this.http.post<any>(href, data);
  }
  updateCustomer(data) {
    const href = `${BaseUrl.USER}/clients`;
    return this.http.put<any>(href,data);
  }

  getCustomerDetailsById(id): Observable<any> {
    const href = `${BaseUrl.USER}/clients/${id}`;
    return this.http.get<any>(href);
  }

  getAllCustomers() {
    const href = `${BaseUrl.USER}/clients`;
    return this.http.get<any>(href);
  }

  getKwFeatures(data) {
    const href = `${BaseUrl.USER}/clients/kwFeatures`
    return this.http.post<any>(href, data);
  }

  getSuFeatures(data) {
    const href = `${BaseUrl.USER}/clients/suFeatures`
    return this.http.post<any>(href, data);
  }

  getRefDomains() {
    const href = `${BaseUrl.USER}/clients/refDomains`
    return this.http.get<any>(href);
  }

  getFeaturesSubFeatures() {
    const href = `${BaseUrl.USER}/clients/kwsuFeatures`
    return this.http.get<any>(href);
  }
}
