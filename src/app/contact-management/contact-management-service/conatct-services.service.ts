import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstantsService } from 'src/app/GobalAPIService/global-constants.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ConatctServicesService {


  uri: any;
  secureUri: any;

  constructor(private http: HttpClient) {
    this.uri = GlobalConstantsService.apiURL;
    this.secureUri = GlobalConstantsService.secureApiURL;
  }

  createList(listDetails) {
    return this.http.post<any>(`${this.secureUri}/list/createList`, listDetails)
  }

  getAllListDetails(customerId) {
    return this.http.get<any>(`${this.secureUri}/list/getAllListDetails/` + customerId)
  }

  getVerificationStatistic(customerId, listId) {
    return this.http.get<any>(`${this.secureUri}/contact/getVerificationStatistic/` + customerId + "/" + listId)
  }

  checkDuplicateList(listName, customerId) {
    return this.http.get<any>(`${this.secureUri}/list/checkDuplicateList/` + listName + "/" + customerId)
  }

  checkDuplicateDomain(domainName, customerId) {
    return this.http.get<any>(`${this.secureUri}/email/checkDuplicateDomain/` + domainName + "/" + customerId)
  }

  uploadContactList(fileData, customerId) {
    var fd = new FormData();
    fd.append('uploadfile', fileData);
    return this.http.post<any>(`${this.secureUri}/contact/uploadContactListMapping/` + customerId, fd)
  }


  // verify contact

  getMailIdVerification(originalEmailId) {
    return this.http.get<any>(`${this.secureUri}/contact/getMailIdVerification/` + originalEmailId)
  }

  // add contact
  getUniqueCustClient(originalEmailId) {
    return this.http.get<any>(`${this.secureUri}/contact/getUniqueCustClient/` + originalEmailId + "/" + sessionStorage.getItem('customerId'))
  }

  saveaddContact(contactInfo) {
    return this.http.post<any>(`${this.secureUri}/contact/saveaddContact`, contactInfo)
  }

  //add sender
  createSender(userInfo) {
    return this.http.post<any>(`${this.secureUri}/sender/createSender`, userInfo)
  }

  getAllSenderDetails(customerId) {
    return this.http.get<any>(`${this.secureUri}/sender/getAllSenderDetails/` + customerId)
  }

  checkDuplicateSender(customerId, emailAddress) {
    return this.http.get<any>(`${this.secureUri}/sender/checkDuplicateSender/` + customerId + "/" + emailAddress)
  }

  fetchAllContacts(firstId, lastId, listId, customerId) {
    return this.http.get<any>(`${this.secureUri}/list/fetchAllContacts/` + firstId + "/" + lastId + "/" + listId + "/" + customerId)
  }

  uploadFile(fileData, previewMapping, customerId, listId) {
    var fd = new FormData();
    fd.append('uploadfile', fileData);
    fd.append('previewMapping', new Blob([JSON
      .stringify(previewMapping)], {
      type: "application/json"
    }));

    return this.http.post<any>(`${this.secureUri}/contact/uploadFile/` + customerId + "/" + listId, fd)
  }


  verifiyFile(fileData, previewMapping, customerId, listId) {
    var fd = new FormData();
    fd.append('uploadfile', fileData);
    fd.append('previewMapping', new Blob([JSON
      .stringify(previewMapping)], {
      type: "application/json"
    }));

    return this.http.post<any>(`${this.secureUri}/contact/verifiyFile/` + customerId + "/" + listId, fd)
  }


  blockArchiveContactList(blackList, value) {
    return this.http.post<any>(`${this.secureUri}/list/blockArchiveContactList`, blackList)
  }

  blockContactList(blackList) {
    return this.http.post<any>(`${this.secureUri}/list/blockContactList`, blackList)
  }

  //download as a .csv file
  downloadCSVFile(data, filename = 'data') {
    let csvData = this.ConvertToCSV(data, ['First_Name', 'Last_Name', 'Email_Address',
      'Country_Code', 'Mobile_No', 'Date_of_birth',
      'City', 'Company_Name', 'Blacklist', 'Archive', 'Unsubscribed']);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);

  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

  //download a xlsx file
  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  getClientCustMapList(customerClientId, customerId) {
    return this.http.get<any>(`${this.secureUri}/list/getClientCustMapList/` + customerClientId + "/" + customerId)
  }

  getClientCustMapCampaign(customerClientId, customerId) {
    return this.http.get<any>(`${this.secureUri}/list/getClientCustMapCampaign/` + customerClientId + "/" + customerId)
  }

  saveEditContact(contactInfo) {
    return this.http.post<any>(`${this.secureUri}/list/saveEditContact`, contactInfo)
  }

  mobileCountryCode() {
    return this.http.get<any>(`${this.uri}/signup/mobileCountryCode`)
  }

  senderVerficationMail(userInfo) {
    return this.http.post<any>(`${this.secureUri}/list/senderVerficationMail`, userInfo)
  }

  getListMaxAndMin(listId, customerId) {
    return this.http.get<any>(`${this.secureUri}/list/getListMaxAndMin/` + listId + "/" + customerId)
  }

  getDomainBlockList(customerId) {
    return this.http.get<any>(`${this.secureUri}/campaign/getDomainBlockList/` + customerId)
  }

  saveDomainBlocker(userInfo) {
    return this.http.post<any>(`${this.secureUri}/campaign/saveDomainBlocker`, userInfo)
  }

  deleteDomainBlockList(domainBlockerSkey) {
    return this.http.get<any>(`${this.secureUri}/campaign/deleteDomainBlockList/` + domainBlockerSkey)
  }

  getEmailNotification(customerId) {
    return this.http.get<any>(`${this.secureUri}/campaign/getEmailNotification/` + customerId)
  }


  sendEmailNotification(notificationData) {
    return this.http.post<any>(`${this.secureUri}/campaign/sendEmailNotification`, notificationData)
  }

  getUniqueEmailNoti(emailId, customerId) {
    return this.http.get<any>(`${this.secureUri}/campaign/getUniqueEmailNoti/` + emailId + "/" + customerId)
  }

  removeFromVerification(customerId, listId) {
    return this.http.get<any>(`${this.secureUri}/contact/removeFromVerification/` + customerId + "/" + listId);
  }

  uploadVerificationContact(customerId, listId, valid, invalid, unknown) {
    return this.http.get<any>(`${this.secureUri}/contact/uploadVerificationContact/` + customerId + "/" + listId + "/" + valid + "/" + invalid + "/" + unknown);
  }

  downLoadStatistic(customerId, listId, firstId, lastId) {
    return this.http.get<any>(`${this.secureUri}/contact/downLoadStatistic/` + customerId + "/" + listId + "/" + firstId + "/" + lastId)
  }

  deleteContact(data) {
    return this.http.post<any>(`${this.secureUri}/list/deleteContact`, data)
  }

  deleteContactFromList(data) {
    return this.http.post<any>(`${this.secureUri}/list/deleteContactFromList`, data,{ responseType: 'text' as 'json' })
  }

}
