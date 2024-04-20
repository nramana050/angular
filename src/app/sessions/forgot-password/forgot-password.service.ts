import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseUrl } from '../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private readonly http: HttpClient) { }

  sendForgotPassword(payload) {
    const href = `${BaseUrl.AUTHENTICATE}/user/forgotPassword`
    return this.http.post<any>(href, payload);
  }
}
