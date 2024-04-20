import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseUrl } from '../../framework/constants/url-constants';
import { LearnersService } from '../learners/learners.services';
import { DocumentsService } from '../captr-learners/view-captr-learner/documents/documents.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  
  constructor(private readonly http: HttpClient,
    private readonly documentsService : DocumentsService,
    private readonly learnersService : LearnersService) { }


  getApplications(sort: string, size: number, page: number, body: any): Observable<any> {
    const href = `${BaseUrl.JOBS}/applications`;
    return this.http.post<any>(href, body, {
       params: new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sort.toString())
    });
 }

 getJobDetails(id: string) {
  return this.learnersService.getJobDetails(id);
}

getApplication(id: string) {
  const href = `${BaseUrl.JOBS}/applications/${id}`;
  return this.http.get<any>(href);
}

getCVDetails(id) {
  const href = `${BaseUrl.CVB}/cvs/attachments/${id}`;
  return this.http.get<any>(href);
}

downloadCV(id: string){
  return this.learnersService.download(id);
}

getDocument(id: number){
  return this.documentsService.fetchDocument(id);
}

downloadDoc(id) {
  return this.documentsService.download(id).subscribe(res => {
    console.log("done");
  });
}


deleteAttachment(id: number, appliactionId: number){
  const href = `${BaseUrl.JOBS}/applications/attachments/${id}`;
  return this.http.delete<any>(href,{
    params: new HttpParams()
       .set('appliactionId', appliactionId.toString())
 });
}
getServiceUserDetails(id) {
  return this.learnersService.getServiceUserDetails(id);
}
updateApplicationStatus(id : any, actionIdentifier: any){
  const body: any = {};
  const href = `${BaseUrl.JOBS}/applications/status/${id}`;
  return this.http.put<any>(href,body,{
    params: new HttpParams()
       .set('actionIdentifier', actionIdentifier.toString())
  });
}

}
