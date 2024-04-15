import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstantsService } from 'src/app/GobalAPIService/global-constants.service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileServicesService {

  private subject = new Subject<any>();

  uri: any;
  secureUri: any;

  constructor(private http: HttpClient) {
    this.uri = GlobalConstantsService.apiURL;
    this.secureUri = GlobalConstantsService.secureApiURL;
  }

  getProfileDetails(customerSkey) {
    return this.http.get<any>(`${this.secureUri}/login/getProfileDetails/` + customerSkey)
  }

  saveProfileDetails(userInfo) {
    return this.http.post<any>(`${this.secureUri}/login/saveProfileDetails`, userInfo)
  }

  getProfileImage(customerSkey) {
    if (customerSkey != null && customerSkey != "") {
      return this.http.get(`${this.secureUri}/login/getProfileImage/` + customerSkey)
    }
  }

  uploadProfilePic(file) {
    console.log(sessionStorage.getItem("customerSkey"));

    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<any>(`${this.secureUri}/login/uploadProfilePic/` + sessionStorage.getItem("customerSkey"), fd)
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  setMessage(message: string) {
    this.subject.next({ text: message });
  }

  getdisable(): Observable<any> {
    return this.subject.asObservable();
  }

  setdisable(message: string) {
    this.subject.next({ text: message });
  }

  getdashboardCount(customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getdashboardCount/` + customerId)
  }

  getdashboardAllContact(firstId, lastId, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getdashboardAllContact/` + firstId + "/" + lastId + "/" + customerId)
  }

  getdashboardOpenContact(firstId, lastId, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getdashboardOpenContact/` + firstId + "/" + lastId + "/" + customerId)
  }

  getdashboardClickContact(firstId, lastId, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getdashboardClickContact/` + firstId + "/" + lastId + "/" + customerId)
  }

  getdashboardBlacklistedContact(firstId, lastId, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getdashboardBlacklistedContact/` + firstId + "/" + lastId + "/" + customerId)
  }

  getdashboardhardBounceContact(firstId, lastId, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getdashboardhardBounceContact/` + firstId + "/" + lastId + "/" + customerId)
  }

  ArchiveCampaign(archiveList) {
    return this.http.post<any>(`${this.secureUri}/dashboard/archiveDashboardContact`, archiveList)
  }

  getMapMaxAndMin(customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getMapMaxAndMin/` + customerId)
  }


  getMapMaxAndMinDashboard(countClickId, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getMapMaxAndMinDashboard/` + countClickId + "/" + customerId)
  }

  getdashboardCampData(campaignId, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getdashboardCampData/` + campaignId + "/" + customerId)
  }

  getdashboardCampHistoryData(campaignId, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getdashboardCampHistoryData/` + campaignId + "/" + customerId)
  }


  getdashboardCampName(processId, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getdashboardCampName/` + processId + "/" + customerId)
  }

  getPaginationdashboardAllContact(pageNo, size, customerId) {
    return this.http.get<any>(`${this.secureUri}/dashboard/getPaginationdashboardAllContact/` + pageNo+"/"+ size + "/" + customerId)
  }

  getCurrentSubscriptionDetails(customerId) {
    return this.http.get<any>(`${this.secureUri}/product/getCurrentSubscriptionDetails/` + customerId)
  }



}
