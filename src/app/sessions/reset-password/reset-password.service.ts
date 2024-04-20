import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private readonly http: HttpClient) { }

  validateAndSavePassword(payload) {
    const href = `${BaseUrl.USER}/user/validateAndSavePassword`;
    return this.http.post<any>(href, payload);
  }

  validatePasswordLink(payload) {
    const href = `${BaseUrl.USER}/user/validatePasswordLink`;
    return this.http.post<any>(href, payload);
  }
}
