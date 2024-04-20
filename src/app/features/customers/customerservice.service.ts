import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from '../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private readonly httpClient: HttpClient,
  ) { }

  uploadLogo(formData: FormData) {
    const href = `${BaseUrl.USER}/client/fileUpload`
    return this.httpClient.post<any>(href, formData);
  }

  updateCustomerDetails(payload: any) {
    const href = `${BaseUrl.USER}/clients`
    return this.httpClient.put<any>(href, payload);
  }

  CreateCustomerDetails(payload: any) {
    const href = `${BaseUrl.USER}/clients`
    return this.httpClient.post<any>(href, payload);
  }
}
