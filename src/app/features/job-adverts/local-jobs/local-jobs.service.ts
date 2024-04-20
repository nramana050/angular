import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseUrl } from '../../../framework/constants/url-constants';
import { FileUploadService } from '../../shared/components/file-upload/file-upload.service';
import { ApplicationService } from '../../application/application.service';
import { LearnersService } from '../../learners/learners.services';

@Injectable({
  providedIn: 'root'
})
export class LocalJobsService {

  constructor(
    private readonly http: HttpClient,
    private readonly fileUploadService: FileUploadService,
    private readonly applicationService: ApplicationService,
    private readonly learnersService: LearnersService

  ) { }

  saveLocalJob(payload: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/nfn`;
    return this.http.post<any>(href, payload);
  }
  updateLocalJob(payload: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/nfn`;
    return this.http.put<any>(href, payload);
  }
  getLocalJob(jobId: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/nfn/${jobId}`;
    return this.http.get<any>(href);
  }

  getLocalJobForSU(jobId: any,userId: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/nfn/${jobId}`;
    return this.http.get<any>(href,{
      params: new HttpParams()
        .set('userId', userId)
    });
  }

  getAllLocalJobs(sort: string, size: number, page: number, keyword: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/nfn`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
        .set('keyword', keyword.toString())
    });
  }

  getAllLocations() {
    const href = `${BaseUrl.JOBS}/job-adverts/ref-data/nfn-locations`;
    return this.http.get<any>(href);
  }

  deleteLocalJob(id: any) {
    const href = `${BaseUrl.JOBS}/job-adverts/nfn/${id}`;
    return this.http.delete<any>(href);
  }

  getInterestedSUs(sort: string, size: number, page: number, jobAdId: string) {
    const href = `${BaseUrl.JOBS}/express-interest/nfn/service-users/${jobAdId}`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
    })
  }

  uploadLogoImage(formData) {
    const href = `${BaseUrl.JOBS}/job-adverts/nfn/uploadImage`;
    return this.fileUploadService.uploadFile(href, formData , 'POST');
  }

  getExpressionOfInterestList(sort: string, size: number, page: number, keyword: any) {
    const href = `${BaseUrl.JOBS}/express-interest/nfn/kw`;
    return this.http.get<any>(href, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', sort.toString())
        .set('keyword', keyword.toString())
    })
  }

  getOFJExpressionOfInterestJob(expressInterestNFNId) {
    const href = `${BaseUrl.JOBS}/express-interest/nfn/kw/${expressInterestNFNId}`;
    return this.http.get<any>(href);
  }

  getCVDetails(id) {
    return this.applicationService.getCVDetails(id);
  }

  downloadCV(id: string) {
    
    return this.learnersService.download(id)
  }

  getDocument(id: number) {
    return this.applicationService.getDocument(id);
  }

  downloadDoc(id) {
    return this.applicationService.downloadDoc(id).subscribe(res => {
    });
  }
  updateApplicationStatus(id: any, actionIdentifier: any, reasonDescription: any) {
    if( actionIdentifier !== 4 ){
      reasonDescription = null ;
    }
    const body: any = {"reasonDescription":reasonDescription,"actionIdentifier":actionIdentifier};
    const href = `${BaseUrl.JOBS}/express-interest/nfn/status/${id}`;
    return this.http.put<any>(href, body, {});
  }

  getJobExpressionStatus() {
    const href = `${BaseUrl.JOBS}/express-interest/nfn/status`;
    return this.http.get<any>(href);
  }

  saveResponse(id: any, actionIdentifier: any, responseDescription: any) {
    const body: any = { "responseDescription": responseDescription, "actionIdentifier": actionIdentifier };
    const href = `${BaseUrl.JOBS}/express-interest/nfn/response/${id}`;
    return this.http.post<any>(href, body, {});
  }

  UpdateResponse(id: any, actionIdentifier: any, responseDescription: any) {
    const body: any = { "responseDescription": responseDescription, "actionIdentifier": actionIdentifier };
    const href = `${BaseUrl.JOBS}/express-interest/nfn/response/${id}`;
    return this.http.put<any>(href, body, {});
  }

}
