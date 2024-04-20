import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseUrl } from "src/app/framework/constants/url-constants";

@Injectable({
    providedIn: 'root'
  })
  export class ApplicationSetupService {
  
    constructor(
      private readonly http: HttpClient
    ) { }
  

    findAllPaginated(sort: string, page: number, size: number, body: any): Observable<any> {
        const href = `${BaseUrl.USER}/links/search`;
        return this.http.post<any>(href, body, {
          params: new HttpParams()
            .set('sort', sort.toString())
            .set('page', page.toString())
            .set('size', size.toString())
        });
      }
      
      createLink(data) {
        const href = `${BaseUrl.USER}/links/create`
        return this.http.post<any>(href, data);
      }

      updateLink(payload) {
        const href = `${BaseUrl.USER}/links/update`
        return this.http.put<any>(href, payload);
      }

      getAllTabs(): Observable<any> {
        const href = `${BaseUrl.USER}/tabs/getAllTabs`;
        return this.http.get(href);
      }
       
      getLink(id): Observable<any> {
        const href = `${BaseUrl.USER}/links/get/${id}`;
        return this.http.get<any>(href);
      }

      findAllPaginatedRoles(sort: string, page: number, size: number, body: any): Observable<any> {
        const href = `${BaseUrl.USER}/roles/list`;
        return this.http.post<any>(href, body, {
          params: new HttpParams()
            .set('sort', sort.toString())
            .set('page', page.toString())
            .set('size', size.toString())
        });
      }

      getRoleDetails(id): Observable<any> {
        const href = `${BaseUrl.USER}/roles/view/${id}`;
        return this.http.get<any>(href);
      }

      getRoleRefData(){
        const href = `${BaseUrl.USER}/roles/refData`;
        return this.http.get<any>(href);
      }

      getLicencesDetail(): Observable<any> {
        const href = `${BaseUrl.USER}/licences`;
        return this.http.get<any>(href);
      }

      findAllPaginatedProgramme(sort: string, page: number, size: number, body: any): Observable<any> {
        const href = `${BaseUrl.USER}/programme/list`;
        return this.http.post<any>(href, body, {
          params: new HttpParams()
            .set('sort', sort.toString())
            .set('page', page.toString())
            .set('size', size.toString())
        });
      }
  }