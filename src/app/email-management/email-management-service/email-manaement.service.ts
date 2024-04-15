import { Injectable } from '@angular/core';
import { GlobalConstantsService } from 'src/app/GobalAPIService/global-constants.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailManaementService {
  uri: any;
  customerId: any;
  campaignId: any;
  secureUri: any;
  constructor(private http: HttpClient) {
    this.uri = GlobalConstantsService.apiURL;
    this.secureUri = GlobalConstantsService.secureApiURL;
    this.customerId = sessionStorage.getItem("customerId");
    this.campaignId = sessionStorage.getItem("campaignId");
  }


  saveCreateProcess(processInfo) {
    processInfo.customerId = this.customerId;
    return this.http.post<any>(`${this.secureUri}/email/saveCreateProcess`, processInfo)
  }

  getAllProcessList() {
    return this.http.get<any>(`${this.secureUri}/email/getAllProcessList/` + sessionStorage.getItem("customerId"))
  }

  getUniqueProcessName(processName) {
    return this.http.get<any>(`${this.secureUri}/email/getUniqueProcessName/` + processName + '/' + sessionStorage.getItem("customerId"))
  }

  getAllCampProcessList() {
    return this.http.get<any>(`${this.secureUri}/campaign/getAllCampProcessList/` + sessionStorage.getItem("customerId"))
  }

  getAllSenderList() {
    return this.http.get<any>(`${this.secureUri}/campaign/getAllSenderList/` + sessionStorage.getItem("customerId"))
  }

  getUnsubscribeCount(factCampaignSkey, customerClientId, bounceReason) {
    return this.http.get<any>(`${this.uri}/signup/getUnsubscribeCount/` + factCampaignSkey + "/" + customerClientId + "/" + bounceReason)
  }

  getAllList() {
    return this.http.get<any>(`${this.secureUri}/campaign/getAllList/` + sessionStorage.getItem("customerId"))
  }

  getAllTemplateList() {
    return this.http.get<any>(`${this.secureUri}/campaign/getAllTemplateList/` + sessionStorage.getItem("customerId"))
  }

  getAllChannelList() {
    return this.http.get<any>(`${this.secureUri}/campaign/getAllChannelList`)
  }

  saveCampaign(ListName) {
    return this.http.post<any>(`${this.secureUri}/campaign/saveCampaignList`, ListName)
  }

  getAllCampaignList() {
    return this.http.get<any>(`${this.secureUri}/campaign/getAllCampaignList/` + sessionStorage.getItem("customerId"))
  }

  createEmailTeamplate(userInfo) {
    return this.http.post<any>(`${this.secureUri}/sender/createEmailTeamplate`, userInfo)
  }

  getEmailTeamplateList(customerId) {
    return this.http.get<any>(`${this.secureUri}/sender/getEmailTeamplateList/` + sessionStorage.getItem("customerId"))
  }
  deleteCampaign(deleteCamp) {
    return this.http.post<any>(`${this.secureUri}/campaign/deleteCampaign`, deleteCamp)
  }

  ArchiveCampaign(archiveList) {
    return this.http.post<any>(`${this.secureUri}/campaign/archiveCampaign`, archiveList)
  }

  getCampainView(firstId, lastId) {
    return this.http.get<any>(`${this.secureUri}/campaign/getCampainView/` + firstId + "/" + lastId + "/" + sessionStorage.getItem("campaignId"))
  }

  getCampainHistoryView(firstId, lastId) {
    return this.http.get<any>(`${this.secureUri}/secure/campaign/getCampainHistoryView/` + firstId + "/" + lastId + "/" + sessionStorage.getItem("campaignId"))
  }

  getCampainViewCount() {
    return this.http.get<any>(`${this.secureUri}/campaign/getCampainViewCount/` + sessionStorage.getItem("campaignId"))
  }

  getCampainHistoryViewCount() {
    return this.http.get<any>(`${this.secureUri}/campaign/getCampainHistoryViewCount/` + sessionStorage.getItem("campaignId"))
  }

  sendTestMail(SendTestMailList) {
    return this.http.post<any>(`${this.secureUri}/campaign/sendTestMail`, SendTestMailList)
  }

  sendMailCampaign(updateSendMailObj) {
    return this.http.post<any>(`${this.secureUri}/campaign/sendMailCampaign`, updateSendMailObj)
  }

  getUniqueCampName(campName) {
    return this.http.get<any>(`${this.secureUri}/campaign/getUniqueCampName/` + campName + '/' + sessionStorage.getItem("customerId"))
  }

  getMapMaxAndMinCampView(campaignId) {
    return this.http.get<any>(`${this.secureUri}/campaign/getMapMaxAndMinCampView/` + campaignId)
  }

  HideShowInclude(ShowHideInculdeList) {
    return this.http.post<any>(`${this.secureUri}/campaign/HideShowInclude`, ShowHideInculdeList)
  }
  pauseCampaign(campaignId) {
    return this.http.get<any>(`${this.secureUri}/campaign/pauseCampaign/` + campaignId)
  }

  getFactCampainCount(campaignId) {
    return this.http.get<any>(`${this.secureUri}/campaign/getFactCampainCount/` + campaignId)
  }

  getFactCampainHistoryCount(campaignId) {
    return this.http.get<any>(`${this.secureUri}/campaign/getFactCampainHistoryCount/` + campaignId)
  }

  resumeCampaign(campaign) {
    return this.http.post<any>(`${this.secureUri}/campaignProcess/resumeCampaign/`, campaign)
  }

  markAsCompletedCampaign(campaignId) {

    return this.http.get<any>(`${this.secureUri}/campaign/markAsCompletedCampaign/`+ campaignId)
  }

  timeZone() {
    return this.http.get<any>(`${this.secureUri}/list/timezone`)
  }

  getEmailCount(day) {
    return this.http.get<any>(`${this.secureUri}/sender/getEmailCount/` +  day)
  }

  checkDuplicateTemplate(templateName, customerId) {
    return this.http.get<any>(`${this.secureUri}/email/checkDuplicateTemplate/` + templateName + "/" + customerId)
  }

}
