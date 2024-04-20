import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from './../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class TrackLiteSyncDataService {

  constructor(private readonly http: HttpClient) { }

  getAllTrackLiteSyncData() {
    const href = `${BaseUrl.PLAN}/sync-data`;
    return this.http.post<any>(href, {});
  }

}
