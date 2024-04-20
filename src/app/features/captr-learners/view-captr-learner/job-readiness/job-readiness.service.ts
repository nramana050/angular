import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrl } from 'src/app/framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class JobReadinessService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  getColours() : Observable<any>{
    const href = `${BaseUrl.JOBS}/ref-data/colours`;
    return this.http.get<any>(href);
  }
  createReadiness(payload) : Observable<any>{
    const href = `${BaseUrl.JOBS}/job-readiness`;
    return this.http.post<any>(href, payload)
  }
  viewReadiness(id) : Observable<any>{
    const href = `${BaseUrl.JOBS}/job-readiness/${id}`;
    return this.http.get<any>(href)
  }

  updateReadiness(payload) : Observable<any>{
    const href = `${BaseUrl.JOBS}/job-readiness`;
    return this.http.put<any>(href, payload)
  }

  getHistory(id: number, userId: number) : Observable<any>{
    const href = `${BaseUrl.JOBS}/job-readiness/history/${userId}/${id}`;
    return this.http.get<any>(href);
  }
}
