import { Injectable } from '@angular/core';
import { BaseUrl } from '../../framework/constants/url-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangeExpiredPasswordService {

  constructor(private readonly http: HttpClient) { }

  sendPasswordChangeDetails(payload) {
    const href = `${BaseUrl.AUTHENTICATE}/user/changeExpiredPassword`;
    return this.http.put<any>(href, payload);
  }
}
