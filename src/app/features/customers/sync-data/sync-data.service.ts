import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrl } from '../../../framework/constants/url-constants';
@Injectable({
  providedIn: 'root'
})
export class SyncDataService {

  constructor(private readonly http: HttpClient) { }

  getAllSyncData() {
    const href = `${BaseUrl.CONTENT_MANAGEMENT}/elasticSearch/syncData`;
    return this.http.get<any>(href);
  }

}
