import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseUrl } from '../../framework/constants/url-constants';
import { Chat } from './go-to-chat/srm-chat.interface';

@Injectable({
  providedIn: 'root'
})
export class SrmService {
  
  constructor(private readonly http: HttpClient) {
  }
  getAllChat(): Observable<Chat[]> {
    return this.http.get<any>(`${BaseUrl.SRM}/srm/chat/search`);
  }

  getTopThreeReceivedChat(): Observable<Chat[]> {
    return this.http.get<any>(`${BaseUrl.SRM}/srm/chat/search-for-notification`);
  }
  getAllMessages(size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.SRM}/srm/messages/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }
  getKwList(identifier): Observable<any> {
    const href = `${BaseUrl.USER}/user/users-by-identifier`;
    return this.http.get<any>(href,{
      params: new HttpParams()
      .set('identifiers',identifier)
    });
  }

  getSuList(identifier): Observable<any> {
    const href = `${BaseUrl.USER}/serviceUser/${identifier}`;
    return this.http.get<any>(href);
  }

  creatMessage(messageJson: any) {
    const href = `${BaseUrl.SRM}/srm/messages/create`;
    return this.http.post<any>(href, messageJson);
  }
  getUnreadMessageCount(): Observable<number> {
    return this.http.get<any>(`${BaseUrl.SRM}/srm/messages/message-count`);
  }

  readAllMessages(body): Observable<any> {
    const href = `${BaseUrl.SRM}/srm/messages/readall`;
    return this.http.post<any>(href, body);
  }


}
