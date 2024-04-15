import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstantsService } from 'src/app/GobalAPIService/global-constants.service';

@Injectable({
  providedIn: 'root'
})
export class AccountServicesService {
 
   
  uri: any;
  customerId: any;
  secureUri: any;
  
  constructor(private http: HttpClient) {
    this.uri = GlobalConstantsService.apiURL;
    this.secureUri = GlobalConstantsService.secureApiURL;
    this.customerId = sessionStorage.getItem("customerId");
  }

  firstCharge(StripCustomer) {
    return this.http.post<any>(`${this.secureUri}/pay/firstCharge`, StripCustomer)
  }
  getMainProductList(productType,countryCode:any) {
    return this.http.get<any>(`${this.secureUri}/product/getMainProductList/`+ productType+"/"+countryCode)
  }
  getSubProductList(productType: any, productName: any,countryCode:any) {
    return this.http.get<any>(`${this.secureUri}/product/getSubProductList/`+ productType+"/"+productName+"/"+countryCode)
  }
  getSendAndUploadCount(customerId: string) {
    return this.http.get<any>(`${this.secureUri}/product/getSendAndUploadCount/`+ customerId)
  }
  getBalanceDetails(customerId: string) {
    return this.http.get<any>(`${this.secureUri}/product/getBalanceDetails/`+ customerId)
  }

  saveComapnyDetails(billingInfo) {
    return this.http.post<any>(`${this.secureUri}/login/saveComapnyDetails`, billingInfo)
  }

  savePaymentEntity(factPaymentEntity: any) {
    return this.http.post<any>(`${this.secureUri}/subscription/savePaymentEntity`, factPaymentEntity)
  }

  getProductInfo(productCode: any, countryCode: any) {
    return this.http.get<any>(`${this.secureUri}/product/getProductInfo/`+productCode+"/"+countryCode)
  }

  downgradePlan(factActivity) {
    return this.http.post<any>(`${this.secureUri}/subscription/downgradePlan`, factActivity)
  }
  
  switchCard(personalInfo: any) {
    return this.http.post<any>(`${this.secureUri}/pay/switchCard`,personalInfo)
  }
  updateStripCustId(stripCustId: any, customerId: string) {
    return this.http.get<any>(`${this.secureUri}/subscription/updateStripCustId/`+stripCustId+"/"+customerId)
  }

  getActivity(customerId) {
    return this.http.get<any>(`${this.secureUri}/subscription/getActivity/`+ customerId)
  }

  cancelRequest(factActivity) {
    return this.http.post<any>(`${this.secureUri}/subscription/cancelRequest`, factActivity)
  }
  addOnsavePaymentEntity(factPaymentEntity: any) {
    return this.http.post<any>(`${this.secureUri}/subscription/addOnsavePaymentEntity`, factPaymentEntity)
  }

  pauseSubscription(pauseDuration: number, customerId: string) {
    return this.http.get<any>(`${this.secureUri}/subscription/pauseSubscription/`+pauseDuration+"/"+customerId)
  }

  pauseSubscriptionNextDueDate(pauseDuration: number, customerId: string) {
    return this.http.get<any>(`${this.secureUri}/subscription/pauseSubscriptionNextDueDate/`+pauseDuration+"/"+customerId)
  }

  closeSubscription(customerId: string) {
    return this.http.get<any>(`${this.secureUri}/subscription/closeSubscription/`+ customerId)
  } 

  transaction(customerId: string) {
    return this.http.get<any>(`${this.secureUri}/subscription/transaction/`+ customerId)
  } 

  resumeSubscription(data) {
    return this.http.post<any>(`${this.secureUri}/subscription/resumeSubscription`, data)
  }

  subscriptionCron() {
    return this.http.get<any>(`${this.secureUri}/subscription/cron/activityDowngridePlan`)
  } 

  checkActivity(data){
    return this.http.post<any>(`${this.secureUri}/subscription/checkActivity`, data)
  }

  billingDetailForm(data){
    return this.http.post<any>(`${this.secureUri}/subscription/billingDetail`, data)
  }

  billId(customerId: string) {
    return this.http.get<any>(`${this.secureUri}/subscription/billId/`+ customerId)
  }

  createBill(invoiceId: number){
    // return this.http.get<any>(`${this.uri}/subscription/createBill/`+ invoiceId)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', responseType : 'blob'});
    return this.http.get<Blob>(`${this.secureUri}/subscription/createBill/`+ invoiceId, { headers : headers, responseType : 
      'blob' as 'json'});
  }

  getCurrentSubscriptionDetails(customerId: string) {
    return this.http.get<any>(`${this.secureUri}/product/getCurrentSubscriptionDetails/`+customerId)
  }
  
}
