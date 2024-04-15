import { Component, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConatctServicesService } from 'src/app/contact-management/contact-management-service/conatct-services.service';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
import { AccountServicesService } from '../account-services/account-services.service';
import Swal from 'sweetalert2';
import { GetSelectedProductService } from '../ServiceOfService/get-selected-product.service';
import { Router } from '@angular/router';
import { GlobalConstantsService } from 'src/app/GobalAPIService/global-constants.service';
import { Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { map, catchError } from 'rxjs/operators';

declare var $: any;
var Totalamount = 0;
var globalCuurency = "";
declare var window: any; // Needed on Angular 8+
const parsedUrl = new URL(window.location.href);
const baseUrl = parsedUrl.origin;
declare var Stripe: any;
Stripe.setPublishableKey(GlobalConstantsService.key);
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-payment-process',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.css']
})
export class PaymentProcessComponent implements OnInit {
  handler: any = null;
  mobilecodeList: any;
  disableFlag = false;
  show = false;
  responseUrl: any;
  temp = 0;
  // Stripe = Stripe(GlobalConstantsService.key);

  billingInfo: any = {
    emailAddress: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    gstinNo: "",
    companyTan: "",
    companyName: "",
    companyAddress: "",
    zipCode: "",
    city: "",
    state: "",
    countryCode: "",
    address: "",
    mobileCountryCode: "",
    gstinAvailable: "",
    customerId: ""
  };

  factPaymentEntity: any = {};
  selectedProduct: any = {};
  cureentProduct: any = {};
  planAmount = 0.0;
  tax = 0.0;
  payAbleAmount = 0.0;
  currency: any;
  currentPlanPayAmount = 0.0;
  key: any;
  proceedFlag: boolean;
  secure3DCheckResp: any;
  tokenId: any;
  tryAgainPay: boolean;

  constructor(private ngZone: NgZone, private router: Router, private getSelectedProductService: GetSelectedProductService, private accountServicesService: AccountServicesService, private conatctServicesService: ConatctServicesService, private profileServicesService: ProfileServicesService) {
    this.key = GlobalConstantsService.key;
  }


  ngOnInit(): void {
    this.show = false;
    if (this.getSelectedProductService.getSelectedProdDetails == null || this.getSelectedProductService.getSelectedProdDetails == undefined || this.getSelectedProductService.getSelectedProdDetails.productCode == undefined) {
      this.router.navigate(['/overview']);
    } else {
      this.loadStripe();
      this.mobileCountryCode();
      this.getProfileDetails();

      this.selectedProduct = this.getSelectedProductService.getSelectedProdDetails;
      console.log(this.selectedProduct, "*");


      this.cureentProduct = this.getSelectedProductService.getCurrentProduct;
      this.calcuation();
    }
    this.proceedFlag = false;
  }

  calcuation() {
    this.tryAgainPay = false;
    this.planAmount = 0.0;
    this.tax = 0.0;
    this.payAbleAmount = 0.0;
    this.currentPlanPayAmount = 0.0;
    if (this.selectedProduct.payIssue != null && this.selectedProduct.payIssue != undefined && this.selectedProduct.payIssue == "1") {
      this.tryAgainPay = true;
    }
    this.currency = this.selectedProduct.dimProductPrice.currencyName;
    this.planAmount = this.selectedProduct.dimProductPrice.productPrice;
    if (this.cureentProduct != null && this.cureentProduct.dimProductPrice != null && this.selectedProduct.payIssue != null && this.selectedProduct.payIssue == "0") {
      this.currentPlanPayAmount = this.cureentProduct.dimProductPrice.productPrice;
      this.tryAgainPay = false;
    }
    if (this.currency == "INR") {
      this.tax = (Number(this.planAmount) - Number(this.currentPlanPayAmount)) / 100 * 18;
    }
    this.payAbleAmount = (Number(this.planAmount) - Number(this.currentPlanPayAmount)) + this.tax;
  }

  //**----------Payment Process------------ */

  openCheckout(productName: string, amount: number, tokenCallback) {
    this.handler = (<any>window).StripeCheckout.configure({
      key: this.key,
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      allowRememberMe: true,
      token: tokenCallback
    });
    this.handler.open({
      name: "MarkZil.",
      description: productName,
      amount: amount * 100,
      currency: this.currency
    });
  }

  paymentProcess() {
    this.pay(this.payAbleAmount);
  }

  pay(amount: any) {
    // globalCuurency = this.currency;
    Totalamount = amount;
    this.openCheckout(this.selectedProduct.productName, amount, (token: any) => {
      this.tokenId = "";
      console.log(token);
      Stripe.source.create({
        type: 'card',
        token: token.id
      }, (status, response) => {
        console.log(response);
        this.stripeCardResponseHandler(response);
      }
      );
    });
  }
  //------------new Testing------/
  stripeCardResponseHandler(response) {
    console.log("**1");
    console.log(response);
    this.tokenId = response.id;
    if (response.error) {
      var message = response.error.message; // this.displayResult("Unexpected card source creation response status: " + status + ". Error: " + message);
      Swal.fire("Unexpected card source creation , Please try again! ")
      return;
    }
    if (response.card.three_d_secure == 'not_supported') {
      return;
    }
    var returnURL = baseUrl + "/web/static";
    Stripe.source.create({
      type: 'three_d_secure',
      amount: Totalamount * 100,
      currency: this.currency,
      three_d_secure: {
        card: response.id
      },
      redirect: {
        return_url: returnURL
      }
    }, (status, response) => {
      this.stripe3DSecureResponseHandler(status, response);
    });
  }

  stripe3DSecureResponseHandler(status, response) {
    console.log("response");
    console.log(response);
    this.temp = 0;
    if (response.error) {
      var message = response.error.message;
      Swal.fire("Unexpected 3DS source creation, Please try again! ")
      // this.displayResult("Unexpected 3DS source creation response status: " + status + ". Error: " + message);
      return;
    }
    // check the 3DS source's status
    if (response.status == 'chargeable') {
      // this.displayResult("This card does not support 3D Secure authentication, but liability will be shifted to the card issuer.");
      return;
    } else if (response.status != 'pending') {
      // this.displayResult("Unexpected 3D Secure status: " + response.status);
      return;
    }
    Stripe.source.poll(
      response.id,
      response.client_secret
      , (status, response) => {
        this.stripe3DSStatusChangedHandler(status, response)
      });
    window.open(response.redirect.url, "", "width=1000,height=1500");
  }

  stripe3DSStatusChangedHandler(status, source) {
    console.log("final source");
    this.temp++;
    console.log(source);
    if (source.status == 'chargeable') {
      var msg = '3D Secure authentication succeeded: ' + source.id + '. In a real app you would send this source ID to your backend to create the charge.';
      // this.displayResult(msg);
      console.log("3D Secure authentication succeeded");
      this.firstCharge(source);
    } else if (source.status == 'failed' && this.temp > 1) {
      var msg = '3D Secure authentication failed.';
      Swal.fire("3D Secure authentication failed, Please try again! ")
    } else if (source.status == 'pending' && this.temp > 1) {
      // $.featherlight.current().close();
      Swal.fire("Unexpected 3D Secure creation, Please try contacting our team! ")
      var msg = "Unexpected 3D Secure status: " + source.status;
    }
  }

  //----------------New Test End--------//
  firstCharge(response: any) {
    if (response != "") {
      this.proceedFlag = true;
      this.billingInfo.client_secret = response.client_secret;
      this.billingInfo.id = response.id;
      this.billingInfo.card = response.three_d_secure.card;
      this.billingInfo.token = this.tokenId;
      this.billingInfo.productPrice = Number(this.payAbleAmount) * 100;
      this.billingInfo.currencyName = this.selectedProduct.dimProductPrice.currencyName;
      this.billingInfo.description = this.selectedProduct.productName;
      this.billingInfo.description = this.billingInfo.description + " | " + this.selectedProduct.productType;
      this.billingInfo.productCode = this.selectedProduct.productCode;

      let resp = this.accountServicesService.firstCharge(this.billingInfo);
      resp.subscribe(data => {
        if (data != null) {
          this.savePaymentRespone(data, this.tokenId, this.billingInfo);
          // this.proceedFlag = true;
        }
      });
    }
  }

  savePaymentRespone(payResponse, token, billInfo) {
    this.factPaymentEntity.dimProduct = this.selectedProduct;
    this.factPaymentEntity.customerId = this.billingInfo.customerId;
    this.factPaymentEntity.productCode = this.billingInfo.productCode;
    this.factPaymentEntity.firstName = this.billingInfo.firstName;
    this.factPaymentEntity.lastName = this.billingInfo.lastName;
    this.factPaymentEntity.amount = payResponse.amount;
    this.factPaymentEntity.currency = payResponse.currency;
    this.factPaymentEntity.tokenId = token;
    this.factPaymentEntity.id = billInfo.id;
    this.factPaymentEntity.card = billInfo.card;
    this.factPaymentEntity.stripecustId = payResponse.customer;
    this.factPaymentEntity.transactionId = payResponse.balance_transaction;
    this.factPaymentEntity.description = payResponse.description;
    this.factPaymentEntity.captured = payResponse.captured;
    this.factPaymentEntity.email = this.billingInfo.emailAddress;
    this.factPaymentEntity.contact = this.billingInfo.mobileNumber;
    this.factPaymentEntity.method = payResponse.payment_method;
    this.factPaymentEntity.comingFrom = "email";


    let resp = this.accountServicesService.savePaymentEntity(this.factPaymentEntity);
    resp.subscribe(data => {
      // console.log("PayEntity", data);
      Toast.fire({
        icon: 'success',
        title: 'Submitted successfully'
      });
      this.router.navigate(['/overview']);
    });
  }

  getProductPriceDetails(productCode, countryCode) {
    let resp = this.accountServicesService.getProductInfo(productCode, countryCode);
    resp.subscribe(data => {
      this.cureentProduct.dimProductPrice = data.dimProductPrice;
      this.calcuation();
    });
  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://js.stripe.com/v3/";
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: this.key,
          locale: 'auto',
          allowRememberMe: true,
          token: function (token: any) {
          }
        });
      }
      window.document.body.appendChild(s);
    }
  }

  //**----------End Payment Process------------ */


  saveDetail(billingDetail: NgForm) {
    // let resp = this.profileServicesService.saveProfileDetails(this.userInfo);
    // resp.subscribe(data => {
    //   if (data == 1 || data == '1') {
        this.billingDetailForm();
        this.paymentProcess();
        if (this.billingInfo.companyName != null && this.billingInfo.companyName != '') {
          this.saveComapnyDetails();
        }
    //   }
    // });

    billingDetail.resetForm();
  }

  mobileCountryCode() {
    let resp = this.conatctServicesService.mobileCountryCode()
    resp.subscribe(data => {
      this.mobilecodeList = data;
    });
  }

  getProfileDetails() {
    if (sessionStorage.getItem("customerId") != null && sessionStorage.getItem("customerId") != undefined) {
      let resp = this.profileServicesService.getProfileDetails(sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.billingInfo = data;
        this.disableFlag = true;
        // console.log(data);
        if (this.cureentProduct != null && this.cureentProduct != undefined && this.cureentProduct != {} && this.cureentProduct.productCode != undefined) {
          this.getProductPriceDetails(this.cureentProduct.productCode, this.billingInfo.countryCode);
        }
      })
    }
  }

  saveComapnyDetails() {
    if (sessionStorage.getItem("customerId") != null && sessionStorage.getItem("customerId") != undefined) {
      let resp = this.accountServicesService.saveComapnyDetails(this.billingInfo);
      resp.subscribe(data => {
        if (data == 1 || data == '1') {
          //console.log("after save");
          // console.log(data);
        }
      });
    }
  }

  billingDetailForm() {
    if (sessionStorage.getItem("customerId") != null && sessionStorage.getItem("customerId") != undefined) {
      if (this.billingInfo.gstinNo != null && this.billingInfo.gstinNo != '') {
        this.billingInfo.gstinAvailable = 'Y';
      }
      this.billingInfo.customerId = sessionStorage.getItem("customerId");
      let resp = this.accountServicesService.billingDetailForm(this.billingInfo);
      // console.log(this.billingInfo,"/78");
      
      resp.subscribe(data => {
        if (data != null) {
          let resp1 = this.accountServicesService.billId(sessionStorage.getItem("customerId"));
          resp1.subscribe(data => {
            this.factPaymentEntity.billingDetailsSkey = data.billingDetailsSkey;
            // console.log(this.factPaymentEntity.billingDetailsSkey, "data");
          });
        }
      });
    }
  }

  toggleSwitch() {
    this.show = !this.show;
  }

}
