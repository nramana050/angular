import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../../framework/constants/url-constants';

@Injectable({
  providedIn: 'root'
})
export class PrisonJobsService {
    
   constructor(private readonly http: HttpClient) { }

   getAllPrisonJobs(sort: string, size: number, page: number, keyword: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/prisons`;
    return this.http.get<any>(href, {
      params: new HttpParams()
         .set('page', page.toString())
         .set('size', size.toString())
         .set('sort', sort.toString())
         .set('keyword', keyword.toString())
   });
  }

  getPrisonJob(jobId: string) {
    const href = `${BaseUrl.JOBS}/job-adverts/prisons/${jobId}`;
    return this.http.get<any>(href);
  }

  savePrisonJob(payload: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/prisons`;
    return this.http.post<any>(href, payload);
  }

  updatePrisonJob(payload: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/prisons`;
    return this.http.put<any>(href,payload);
  }
  
  deleteLocalJob(id: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/prisons/${id}`;
    return this.http.delete<any>(href);  }
}
