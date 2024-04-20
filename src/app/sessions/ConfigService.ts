import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseUrl } from '../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  getConfig() {
    const url = BaseUrl.CLIENT_URL;
    const href = `${BaseUrl.USER}/clients/getByUrl`;
    return this.http.get<any>(href, { params: new HttpParams().set('url', url) });
 }
}
