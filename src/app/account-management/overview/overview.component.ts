import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { GlobalConstantsService } from 'src/app/GobalAPIService/global-constants.service';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
import Swal from 'sweetalert2';
import { AccountServicesService } from '../account-services/account-services.service';
import { GetSelectedProductService } from '../ServiceOfService/get-selected-product.service';


declare var $: any;
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
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  numChecked = 0;
  submitted = false;
  fg: FormGroup;
  dateApply = false;
  activeState = '';
  handler: any = null;
  activePlan = '';
  pauseDuration = 2;
  pause = false;
  cancelSub = false;

  plans = [
    'Monthly',
    'Annually'
  ]


  formData = {
    startDate: "",
    endDate: ""
  };

  resume = {
    pauseSubscription: ""
  };

  subscription: any = [];

  cards: any = [];
  allCardData: any = [];
  subProduct: any = [];
  activeProduct: any = [];
  sendUploadStatastic: any = {};
  contactPercentage: any;
  mailPercentage: any;
  balance: any = [];
  personalInfo: any = {};
  key: any;
  mailFlag = false;
  contactFlag = false;
  paymentFail = false;
  noBasicCard: any = [];
  noPlan: boolean;
  pauseDate: any;
  planValue: any;
  count: number;
  openSlider: boolean;
  prodName: any;
  uploadContact: any;
  sendMail: any;
  prodType: any;
  tokenId:any;
  payFlag: boolean;
  currentCard: any= [];
  payPrevious: any;

  constructor(private profileServicesService: ProfileServicesService, private getSelectedProductService: GetSelectedProductService, private router: Router, private fb: FormBuilder, private accountServicesService: AccountServicesService) {
    this.fg = new FormGroup(
      {
        from: new FormControl(""),
        to: new FormControl("")
      },
      [Validators.required, this.dateRangeValidator]
    );

    this.key = GlobalConstantsService.key;
  }

  ngOnInit(): void {

    $(document).ready(function () {
      $("#show").click(function () {
        $("#cancel").toggle(100);
      });
    });
    $("#cancel").hide();
    this.getCurrentProductStatastics();
    this.formatSubtitle(50);
    this.getProfileDetails();
    this.loadStripe();
    this.pauseFlag();
    this.getPayIssue();
    this.openSlider = false;


  }

  dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    const from = this.fg && this.fg.get("from").value;
    const to = this.fg && this.fg.get("to").value;
    if (from && to) {
      invalid = new Date(from).valueOf() > new Date(to).valueOf();
    }
    return invalid ? { invalidRange: { from, to } } : null;
  };

  formatSubtitle = (percent: number): string => {
    if (percent >= 100) {
      // $("#stroke").click(function(){
      //   $("circle-progress").css("stroke", "red!important");
      // });
      // console.log('km');
      return "Congratulations!"
    } else if (percent >= 50) {
      // $("circle-progress").css({ 'stroke': 'LightYellow!important' });
      // console.log('mk');
      return "Half"
    } else if (percent > 0) {
      return "Just began"
    } else {
      return "Not started"
    }
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
    }
    else if (this.balance.contactBalance === 0 && this.balance.sendMail == 0) {
      // console.log('hwer');
      this.getSelectedProductService.selectedProdDetails = card;
      this.router.navigate(['/pay']);
    }
    else {
      Swal.fire("Selected plan already active , try another one! ")
    }

  }

  redirectToPlan() {
    this.router.navigate(['/plan']);
  }

  onSubmit() { this.submitted = true; }

  ondowngrade() {
    Swal.fire({
      title: 'Do you want to continue?',
      text: "As you have selected Standard plan,this is Downgrade process",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        // // Swal.fire(
        // //   'Deleted!',
        // //   'Your file has been deleted.',
        // //   'success'
        // )
        this.router.navigate(['/downgrade'])
      }
    })
  }

  switchCard() {
    Swal.fire({
      title: 'As you have sure ?',
      text: "You want to switch your card",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.openCheckout("switch card", (token: any) =>
          this.getStripCustId(token.id) 
        );
      }
    })
  }

  getStripCustId(token) {
    this.personalInfo.token = token;
    let resp = this.accountServicesService.switchCard(this.personalInfo);
    resp.subscribe(data => {
      if (data != null) {
        this.updateStripCustId(data.id);
      }
    });
  }
  updateStripCustId(stripCustId) {
    let resp = this.accountServicesService.updateStripCustId(stripCustId, sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null && (data == '1' || data == 1)) {
        Toast.fire({
          icon: 'success',
          title: 'Card updated successfully'
        });
      }
    });
  }

  getProfileDetails() {
    if (sessionStorage.getItem("customerId") != null && sessionStorage.getItem("customerId") != undefined) {
      let resp = this.profileServicesService.getProfileDetails(sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.personalInfo = data;
      });
    }
  }


  openCheckout(productName: string, tokenCallback) {
    let handler = (<any>window).StripeCheckout.configure({
      key: this.key,
      locale: "auto",
      token: tokenCallback
    });
    handler.open({
      name: "MarkZil",
      description: productName,
      zipCode: false,
      allowRememberMe: true,
      panelLabel: "Update"
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
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            // console.log(token)
            alert('Payment Success!!');
          }
        });
      }
      window.document.body.appendChild(s);
    }
  }

  closeSubscription() {
    this.closeModal();
    Swal.fire({
      title: 'Close Subscription',
      text: "Before closing the subscription, download your data or delete the data. Otherwise, you will lose it",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Close Subscription!'
    }).then((result) => {
      if (result.isConfirmed) {
        let resp = this.accountServicesService.closeSubscription(sessionStorage.getItem("customerId"));
        resp.subscribe(data => {
          if (data != null && (data == '1' || data == 1)) {
            Swal.fire(
              'Closed',
              'Your subscription has been closed',
              'success'
            );
            this.router.navigate(['/profile-edit']);
          }
        });
      }
    })
    // this.router.navigate(['/overview'])
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

  getCurrentProductStatastics() {
    this.contactFlag = false;
    this.mailFlag = false;
    this.paymentFail = false;
    let resp = this.accountServicesService.getBalanceDetails(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null) {
        this.balance = data;        
        this.getProductPriceDetails(this.balance.dimProduct.productCode, sessionStorage.getItem("countryCode"));
      }
      else{
        this.setPlanasActive("Monthly");
      }
    });

    let resp2 = this.accountServicesService.getSendAndUploadCount(sessionStorage.getItem("customerId"));
    resp2.subscribe(data => {
      if (data != null) {
        this.sendUploadStatastic = data;
        var contact = this.sendUploadStatastic.uploadCount / (this.balance.contactBalance);
        this.contactPercentage = contact * 100;

        var mail = this.sendUploadStatastic.sendCount / (this.balance.sendMail);
        this.mailPercentage = mail * 100;
        if (this.sendUploadStatastic.uploadCount > this.balance.contactBalance) {
          if (this.balance.contactBalance == 0 && this.balance.sendMail == 0) {
            this.paymentFail = true;
            this.contactFlag = false;
            this.mailFlag = false;
          }
          else {
            this.contactFlag = true;
            this.paymentFail = false;
          }
        }
        else {
          this.contactFlag = false;
        }
        if (this.sendUploadStatastic.sendCount > this.balance.sendMail) {
          if (this.balance.contactBalance == 0 && this.balance.sendMail == 0) {
            this.mailFlag = false;
            this.contactFlag = false;
            this.paymentFail = true;
          }
          else {
            this.mailFlag = true;
            this.paymentFail = false;
          }
        }
        else {
          this.mailFlag = false;
        }

      }
    });
  }

  getMainProductList(productType) {
    this.cards = [];
    this.allCardData = [];
    let resp = this.accountServicesService.getMainProductList(productType, sessionStorage.getItem("countryCode"));
    resp.subscribe(data => {
      this.allCardData = data;
      if (this.balance != null && this.balance.length != 0) {
        if (this.balance.dimProduct.productName != "Basic") {
          for (var i = this.allCardData.length - 1; i >= 0; i--) {
            if (this.allCardData[i].productName == "Basic") {
              this.noPlan = false;
              this.allCardData.splice(i, 1);
              this.cards = this.allCardData;
              for(let m in this.cards){
                if(this.balance.dimProduct.productType == this.cards[m].productType){
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
        // this.noPlan = true;
        // this.cards = this.allCardData;
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
        this.prodName = this.subProduct[this.subProduct.length-1].productName;   
        this.uploadContact = this.subProduct[this.subProduct.length-1].uploadContact;
        this.prodType = this.subProduct[this.subProduct.length-1].productType;
        this.sendMail = this.subProduct[this.subProduct.length-1].sendMail;
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

  
  getNextDueDate() {
    let resp = this.accountServicesService.pauseSubscriptionNextDueDate(this.pauseDuration, sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null) {
        data = moment(data).format("DD-MM-YYYY");
        this.pauseDate = data;
      }
    });
    // this.getMaxPause();
  }

  pauseSubscription() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to pause the subscription for " + this.pauseDuration + " months?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        let resp = this.accountServicesService.pauseSubscription(this.pauseDuration, sessionStorage.getItem("customerId"));
        resp.subscribe(data => {
          if (data != null && (data == '1' || data == 1)) {
            Swal.fire(
              'Paused!',
              'Your subscription has been paused',
              'success'
            );
            this.profileServicesService.setdisable("hey3");
            this.router.navigate(['/profile-edit']);
          }
          else if (data != null && (data == '0' || data == 0)) {
            Swal.fire("Unable to pause your account as you have exceeded your pause times")
          }
        });
      }
    });
  }

  closeModal() {
    document.getElementById("myModal").style.display = "none"
    document.getElementById("myModal").style.display = "none"
    document.getElementById("myModal").className += document.getElementById("myModal").className.replace("show", "")
    document.body.style.overflowY = "auto";
  }

  pauseFlag() {
    this.subscription = [];
    this.cancelSub = false;
    this.pause = false;
    let resp = this.profileServicesService.getCurrentSubscriptionDetails(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null) {
        this.subscription = data;
        if (data.pauseSubscription == "Y") {
          this.pause = true;
          this.profileServicesService.setdisable("hey1");
        }
        else {
          this.pause = false;
        }
      }
      else {
        this.cancelSub = true;
        this.pause = false;
      }
    });
  }

  resumeSubscription() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to resume your subscription?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resume.pauseSubscription = null;
        let resp = this.accountServicesService.resumeSubscription(this.subscription);
        resp.subscribe(data => {
          Swal.fire(
            'Resumed!',
            'Your subscription has been resumed.',
            'success'
          );
          this.profileServicesService.setdisable("enable");
          this.pauseFlag();
        });
      }
    });
    // this.resume.pauseSubscription = null;
    // let resp = this.accountServicesService.resumeSubscription(this.subscription);
    // resp.subscribe(data => {
    //   this.pauseFlag();
    // });

  }

  // getMaxPause() {
  //   let resp = this.accountServicesService.pauseSubscription(this.pauseDuration, sessionStorage.getItem("customerId"));
  //   resp.subscribe(data => {
  //     if (data != null && (data == '0' || data == 0)) {
  //       document.getElementById("myModal2").style.display = "none"
  //       document.getElementById("myModal2").style.display = "none"
  //       document.getElementById("myModal2").className += document.getElementById("myModal2").className.replace("show", "")
  //       document.body.style.overflowY = "auto";

  //       Swal.fire("Unable to pause your account as you have exceeded your pause times");
  //     }
  //   });

  // }

  getPlanValue(productName, productType) {
    if(this.balance != null){
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
              this.currentCard = this.cards[m];
              this.count = Number(i);
              this.getPlanValue(this.cards[m].productName, this.cards[m].productType);
            }
          }
        }
      }
    }
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

  currentPaymentIssue(){
    if(this.payFlag == true){
      this.getCurrentProductStatastics();
        if (this.balance != null && this.currentCard != null) {
          this.currentCard.payIssue = "1";
          this.getSelectedProductService.selectedProdDetails = this.currentCard;
          this.router.navigate(['/pay']);
        }
    }
  }

}
