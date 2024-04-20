import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../../../framework/constants/url-constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {

  constructor(private readonly http: HttpClient) {

  }
  getAllTabs(): Observable<any> {
    const href = `${BaseUrl.USER}/tabs`;
    return this.http.get(href);
  }

  createTabs(payload): Observable<any> {
    const href = `${BaseUrl.USER}/tabs`;
    return this.http.post(href, payload);
  }

  updateTabs(payload): Observable<any> {
    const href = `${BaseUrl.USER}/tabs`;
    return this.http.put(href, payload);
  }

  getTabsDetails(id: number): Observable<any> {
    const href = `${BaseUrl.USER}/tabs/${id}`;
    return this.http.get(href);
  }

  getTabsAndLinksDetails(id: number): Observable<any> {
    const href = `${BaseUrl.USER}/tabs/getTabLinkDetails/${id}`;
    return this.http.get(href);
  }
  
  onDeleteTab(id: number): Observable<any> {
    const href = `${BaseUrl.USER}/tabs/${id}`;
    return this.http.delete(href);
  }

}
