import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalConstantsService } from 'src/app/GobalAPIService/global-constants.service';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
import Swal from 'sweetalert2';
import { AccountServicesService } from '../account-services/account-services.service';
import { GetSelectedProductService } from '../ServiceOfService/get-selected-product.service';

declare var $: any;
declare var window: any; // Needed on Angular 8+
const parsedUrl = new URL(window.location.href);
const baseUrl = parsedUrl.origin;
declare var Stripe:any;
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
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css']
})
export class PlanDetailComponent implements OnInit {

  showMainContent: Boolean = true;
  handler: any = null;
  cards: any = [];

  plans = [
    'Monthly',
    'Annually'
  ]

  selected: any;

  activeState = '';

  activePlan = '';
  factPaymentEntity: any = {};
  subProduct: any = [];
  sendUploadStatastic: any = {};
  balance: any = [];
  addOn: any;
  personalInfo: any = {};
  key: any;
  proceedFlag: boolean;
  noPlan: boolean;
  allCardData: any = [];
  count: number;
  planValue: number;
  openSlider: boolean;
  prodName: any;
  uploadContact: any;
  prodType: any;
  sendMail: any;
  tokenId: any;
  addOnprice: any;
  currencyName: any;
  payFlag: boolean;
  temp =0;
  payPrevious: any;
  constructor(private profileServicesService: ProfileServicesService, private router: Router, private getSelectedProductService: GetSelectedProductService, private accountServicesService: AccountServicesService) {
    this.key = GlobalConstantsService.key;
  }

  ngOnInit(): void {

    this.proceedFlag = false;
    this.openSlider = false;

    this.getPayIssue();
    this.getCurrentProductStatastics();
    this.getProfileDetails();
    this.loadStripe();
    this.selected;
    //planToggle
    $(document).ready(function () {
      $("#show").click(function () {
        $("#tr").slideToggle(300);
      });
    });
    $("#tr").hide();
    this.showMainContent = false;

    //slider
    $(document).ready(function () {
      $("#formButton").click(function () {
        $("#form1").slideToggle(300);
      });
    });
    $("#form1").hide();

    //active click
    $('#profile').click(function () {
      if ($('#profile').hasClass('active')) {
        $('#profile').removeClass('active')
      } else {
        $('#profile').addClass('active')
      }
    });
  }

  redirectToPlan() {
    this.router.navigate(['/plan']);
  }

  hideShowToggle(value) {
    if (value == "compare") {
      $("#form1").hide();
      // $(document).ready(function () {
      //   $("#show").click(function () {
      //     $("#tr").slideToggle(300);
      //   });
      // });
    }
    else if (value == "calculate") {
      $("#tr").hide();
      $(document).ready(function () {
        $("#formButton").click(function () {
          $("#form1").slideToggle(300);
        });
      });
    }
  }

  getProfileDetails() {
    if (sessionStorage.getItem("customerId") != null && sessionStorage.getItem("customerId") != undefined) {
      let resp = this.profileServicesService.getProfileDetails(sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.personalInfo = data;
      })
    }
  }

  getMainProductList(productType) {
    this.cards = [];
    this.allCardData = [];
    let resp = this.accountServicesService.getMainProductList(productType, sessionStorage.getItem("countryCode"));
    resp.subscribe(data => {
      // this.cards = data;
      this.allCardData = data;
      if (this.balance != null && this.balance.length != 0) {
        if (this.balance.dimProduct.productName != "Basic") {
          for (var i = this.allCardData.length - 1; i >= 0; i--) {
            if (this.allCardData[i].productName == "Basic") {
              this.noPlan = false;
              this.allCardData.splice(i, 1);
              this.cards = this.allCardData;
              for (let m in this.cards) {
                if (this.balance.dimProduct.productType == this.cards[m].productType) {
                  this.getSubProductList(this.balance.dimProduct.productType, this.balance.dimProduct.productName);
                }
              }
            }
          }
        }
        else if (this.balance.dimProduct.productName == "Basic") {
          this.noPlan = true;
          this.cards = this.allCardData;
        }
      }
      else {
        for (var i = this.allCardData.length - 1; i >= 0; i--) {
          if (this.allCardData[i].productName == "Basic") {
            this.noPlan = true;
            this.allCardData.splice(i, 1);
            this.cards = this.allCardData;
          }
        }
      }
    });
  }

  getSubProductList(productType, productName) {
    if (productType != "FREE") {
      let resp = this.accountServicesService.getSubProductList(productType, productName, sessionStorage.getItem("countryCode"));
      resp.subscribe(data => {
        this.subProduct = data;
        this.prodName = this.subProduct[this.subProduct.length - 1].productName;
        this.uploadContact = this.subProduct[this.subProduct.length - 1].uploadContact;
        this.prodType = this.subProduct[this.subProduct.length - 1].productType;
        this.sendMail = this.subProduct[this.subProduct.length - 1].sendMail;
        this.planValue = 1;
        if (this.balance.length != 0 && this.balance != null) {
          this.getPlanValue(this.prodName, this.prodType);
          if (this.balance.dimProduct.productName == productName && this.balance.dimProduct.productType == productType) {
            this.getCurrentProduct();
          }
        }
      });
    } else {
      this.subProduct = [];
      this.openSlider = false;
    }
  }

  switchProductCart() {
    let selection = $("#my-range").val();
    var productCode = $('.dataSlider')[selection - 1].value;
    for (let i in this.subProduct) {
      if (this.subProduct[i].productCode == productCode) {
        for (let m in this.cards) {
          if (this.cards[m].productName == this.subProduct[i].productName) {
            this.cards[m] = this.subProduct[i];
          }
        }
      }
    }
  }

  setStateAsActive(card) {
    this.activeState = card;
    this.openSlider = true;
  }

  setPlanasActive(plan) {
    this.activePlan = plan;
    this.subProduct = [];
    this.getMainProductList(plan);
    this.openSlider = false;
  }

  getCurrentProductStatastics() {
    let resp = this.accountServicesService.getBalanceDetails(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null) {
        this.balance = data;
        this.getProductPriceDetails(this.balance.dimProduct.productCode, sessionStorage.getItem("countryCode"));
      }
      else {
        this.setPlanasActive("Monthly");
      }
    });
    this.setPlanasActive("Monthly");
    let resp2 = this.accountServicesService.getSendAndUploadCount(sessionStorage.getItem("customerId"));
    resp2.subscribe(data => {
      if (data != null) {
        this.sendUploadStatastic = data;
      }
    });
  }
  getProductPriceDetails(productCode, countryCode) {
    let resp = this.accountServicesService.getProductInfo(productCode, countryCode);
    resp.subscribe(data => {
      this.balance.dimProductPrice = data.dimProductPrice;
      if (this.balance.dimProduct.productType == 'Annually') {
        this.setPlanasActive("Annually");
        this.getSubProductList(this.balance.dimProduct.productType, this.balance.dimProduct.productName);
      }
      else {
        this.setPlanasActive("Monthly");
        this.getSubProductList(this.balance.dimProduct.productType, this.balance.dimProduct.productName);
      }
    });
  }
  redirectToPay(card) {
    card.payIssue = this.payPrevious;
    if (this.balance.length === 0) {
      this.getSelectedProductService.selectedProdDetails = card;
      this.router.navigate(['/pay']);
    }
    else if ((this.balance != null || this.balance.dimProduct != null) && this.balance.dimProduct.productCode != card.productCode && this.balance.contactBalance != 0 && this.balance.sendMail != 0) {
      this.getSelectedProductService.selectedProdDetails = card;
      if (this.balance != null && this.balance.dimProduct != null && this.balance.dimProductPrice != null && Number(this.balance.dimProductPrice.productPrice) > Number(card.dimProductPrice.productPrice)) {
        //downgrade
        this.getSelectedProductService.selectedPlan = this.balance;
        this.router.navigate(['/downgrade']);
      } else {
        if (this.balance != null && this.balance.dimProduct != null) {
          this.balance.dimProduct.sendUploadStatastic = this.sendUploadStatastic;
          this.getSelectedProductService.currentProduct = this.balance.dimProduct;
          this.router.navigate(['/pay']);
        } else {
          this.router.navigate(['/pay']);
        }
      }
    } else if (this.balance.contactBalance === 0 && this.balance.sendMail == 0) {
      this.getSelectedProductService.selectedProdDetails = card;
      this.router.navigate(['/pay']);
    }
    else {
      Swal.fire("Selected plan already active, try another one! ")
    }
  }

  addOnContact() {
  }

  payAddOn() {
    if (this.addOn != null && this.addOn != "") {
      let addOnprice = this.balance.dimProductPrice.additionalSendMailPrice * 10 * this.addOn;
      this.openCheckout("Add-On", addOnprice, (token: any) => {
        this.tokenId = token.id;
        this.addOnprice = addOnprice;
        this.currencyName = this.balance.dimProductPrice.currencyName;
        // this.addOnCharge(token.id, addOnprice, this.balance.dimProductPrice.currencyName)
        Stripe.source.create({
          type: 'card',
          token: token.id
        }, (status, response) => {
          console.log(response);
          this.stripeCardResponseHandler(response);
        });
      });
    }
  }

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
      amount: this.addOnprice * 100,
      currency: this.currencyName,
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
    this.temp =0;
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
        this.stripe3DSStatusChangedHandler(status, response);
      });
    window.open(response.redirect.url, "", "width=1000,height=1500");
  }

  stripe3DSStatusChangedHandler(status, source) {
    console.log("final source");
    console.log(source);
    this.temp++;
    if (source.status == 'chargeable') {
      var msg = '3D Secure authentication succeeded: ' + source.id + '. In a real app you would send this source ID to your backend to create the charge.';
      // this.displayResult(msg);
      console.log("3D Secure authentication succeeded");
      this.addOnCharge(source);
    } else if (source.status == 'failed'  && this.temp > 1) {
      var msg = '3D Secure authentication failed.';
      Swal.fire("3D Secure authentication failed, Please try again! ")
    } else if (source.status == 'pending'  && this.temp > 1) {
      // $.featherlight.current().close();
      Swal.fire("Unexpected 3D Secure creation, Please try contacting our team! ")
      var msg = "Unexpected 3D Secure status: " + source.status;
    }
  }




  addOnCharge(response: any) {
    this.proceedFlag = true;
    this.personalInfo.client_secret = response.client_secret;
    this.personalInfo.id = response.id;
    this.personalInfo.card = response.three_d_secure.card;
    this.personalInfo.token = this.tokenId;
    this.personalInfo.productPrice = Number(this.addOnprice) * 100;
    this.personalInfo.currencyName = this.currencyName;
    this.personalInfo.description = "add-on";
    let resp = this.accountServicesService.firstCharge(this.personalInfo);
    resp.subscribe(data => {
      if (data != null) {
        this.savePaymentRespone(data, this.tokenId,this.personalInfo)
      } 
    }); 
  }
  savePaymentRespone(payResponse, token,billInfo) {
    this.factPaymentEntity.customerId = this.personalInfo.customerId;
    this.factPaymentEntity.firstName = this.personalInfo.firstName;
    this.factPaymentEntity.lastName = this.personalInfo.lastName;
    this.factPaymentEntity.amount = payResponse.amount;
    this.factPaymentEntity.currency = payResponse.currency;
    this.factPaymentEntity.tokenId = token;
    this.factPaymentEntity.id = billInfo.id;
    this.factPaymentEntity.card = billInfo.card;
    this.factPaymentEntity.stripecustId = payResponse.customer;
    this.factPaymentEntity.transactionId = payResponse.balance_transaction;
    this.factPaymentEntity.description = payResponse.description;
    this.factPaymentEntity.captured = payResponse.captured;
    this.factPaymentEntity.email = this.personalInfo.emailAddress;
    this.factPaymentEntity.contact = this.personalInfo.mobileNumber;
    this.factPaymentEntity.method = payResponse.payment_method;
    this.factPaymentEntity.comingFrom = "add-on";
    this.factPaymentEntity.addOnContact = this.addOn;
    let resp = this.accountServicesService.addOnsavePaymentEntity(this.factPaymentEntity);
    resp.subscribe(data => {
      if (data != null) {
        Toast.fire({
          icon: 'success',
          title: 'added successfully'
        });
        this.router.navigate(['/overview']);
      }
    });
  }

  openCheckout(productName: string, amount1: number, tokenCallback) {
    let handler = (<any>window).StripeCheckout.configure({
      key: this.key,
      locale: "auto",
      token: tokenCallback
    });
    handler.open({
      name: "MarkZil",
      description: productName,
      zipCode: false,
      amount: amount1 * 100,
      // panelLabel: "Pay "+amount1,
      currency: this.balance.dimProductPrice.currencyName,
      allowRememberMe: true
    });
  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: this.key,
          locale: 'auto',
          token: function (token: any) {
          }
        });
      }
      window.document.body.appendChild(s);
    }
  }

  getPlanValue(productName, productType) {
    if (this.balance != null) {
      if (this.balance.dimProduct.productName == productName && this.balance.dimProduct.productType == productType) {
        for (let i = 0; i < this.subProduct.length; i++) {
          if (i == this.count) {
            this.planValue = i;
            this.planValue = this.planValue + 1;
          }
        }
      }
      else {
        this.planValue = 1;
      }
    }
    else {
      this.planValue = 1;
    }
  }

  getCurrentProduct() {
    // console.log(this.subProduct);
    if (this.balance != null && this.balance.length != 0) {
      for (let i in this.subProduct) {
        if (this.subProduct[i].productCode == this.balance.dimProduct.productCode) {
          for (let m in this.cards) {
            if (this.cards[m].productName == this.subProduct[i].productName) {
              this.cards[m] = this.subProduct[i];
              this.count = Number(i);
              this.getPlanValue(this.cards[m].productName, this.cards[m].productType);
            }
          }
        }
      }
    }
  }

  notSelected() {
    Swal.fire("Please select contacts! ")
  }

  getPayIssue(){
    this.payFlag = false;
    let resp = this.accountServicesService.getCurrentSubscriptionDetails(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if(data != null && data.payIssue == "1"){
        this.payFlag = true;      
        this.payPrevious = "1";  
      }
      else{
        this.payPrevious = "0";
      }
    });
  }

}
