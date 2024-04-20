import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from './../../framework/constants/url-constants';

@Injectable()
export class ManageOrganisationsService {

  constructor(private readonly http: HttpClient) { }

  findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
    const href = `${BaseUrl.AUTHENTICATE}/manageOrganization/search`;
    return this.http.post<any>(href, body, {
      params: new HttpParams()
        .set('sort', sort.toString())
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  getOrganisationById(id): Observable<any> {
    const href = `${BaseUrl.AUTHENTICATE}/manageOrganization/${id}`;
    return this.http.get<any>(href);
  }

  createOrganisation(payload) {
    const href = `${BaseUrl.AUTHENTICATE}/manageOrganization`;
    return this.http.post<any>(href, payload);
  }

  updateOrganisation(payload) {
    const href = `${BaseUrl.AUTHENTICATE}/manageOrganization`;
    return this.http.put<any>(href, payload);
  }

}
