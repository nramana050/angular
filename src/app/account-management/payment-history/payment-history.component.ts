import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderPipe } from 'ngx-order-pipe';
import { iif } from 'rxjs';
import { AccountServicesService } from '../account-services/account-services.service';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';
import jsPDF from 'jspdf';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import htmlToPdfmake from 'html-to-pdfmake';

// import * as html2canvas from 'html2canvas';
@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  @ViewChild('pdfTable') pdfTable: ElementRef;

  order: string = 'createdAt';
  reverse: boolean = true;
  paymentList: any = [];
  allPaymentEntries: any = [];
  dobflag1 = false;
  dobflag2 = false;
  dateFilterFlg = false;
  billData: any = [];

  formData = {
    startDate: "",
    endDate: ""
  };

  //Pagination
  p = 1;
  showData = {
    //rows Per Page
    rowsPerPage: 5
  };

  submitted = false;
  transactionDetails: any = [];
  dateFlag = false;
  profileInfo: any = [];
  alldata: any = [];
  actualAmount = 0.0;
  tax = 0.0;
  billGenerate: any = [];



  constructor(public datepipe: DatePipe, private fb: FormBuilder, private accountServicesService: AccountServicesService, private orderPipe: OrderPipe, private profileServicesService: ProfileServicesService) {
  }

  ngOnInit(): void {
    this.transactionList();
    this.getProfileDetails();

  }


  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Start date should be less than end date"
        };
      }
      return {};
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  transactionList() {
    this.transactionDetails = [];
    this.allPaymentEntries = [];
    let resp = this.accountServicesService.transaction(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      
      this.paymentList = data;
      for (let i in data) {
        var amount = data[i].amount / (100);
        this.paymentList[i].amount = amount;
      }
      this.allPaymentEntries = this.paymentList;
      this.transactionDetails = this.allPaymentEntries;
      // console.log(this.transactionDetails);

    });
  }

  reverseAndTimeStamp(dateString) {
    let d1 = this.datepipe.transform(dateString, "yyyy-MM-dd");
    return d1;
  }

  compareDate() {
    let fr = this.datepipe.transform(this.formData.startDate, "yyyy-MM-ddThh:mm");
    let to = this.datepipe.transform(this.formData.endDate, "yyyy-MM-ddThh:mm");
    if (fr != null || fr != '' || fr != undefined) {
      if (fr <= to) {
        this.dateFlag = false;
      }
      else {
        this.dateFlag = true;
      }
    }
  }

  filterDate() {
    this.transactionDetails = [];

    this.dateValid1();
    this.dateValid2();
    let fr = this.datepipe.transform(this.formData.startDate, "yyyy-MM-ddThh:mm");
    let to = this.datepipe.transform(this.formData.endDate, "yyyy-MM-ddThh:mm");

    if (this.formData.startDate != null && this.formData.startDate != undefined && this.formData.startDate != ""
      && this.formData.endDate != null && this.formData.endDate != undefined && this.formData.endDate != "") {
      // this.dateFilterFlg = true;
      let selectedMembers = this.allPaymentEntries.filter(f =>
        new Date(this.reverseAndTimeStamp(f.createdAt)) >= new Date(this.formData.startDate)
        && new Date(this.reverseAndTimeStamp(f.createdAt)) <= new Date(this.formData.endDate));
      this.transactionDetails = selectedMembers;
    } else {
      this.transactionDetails = this.allPaymentEntries;
    }
  }

  dateValid1() {
    if (this.formData.startDate == null || this.formData.startDate == undefined || this.formData.startDate == "") {
      this.dobflag1 = true;
    } else {
      this.dobflag1 = false;
    }
  }

  dateValid2() {
    if (this.formData.endDate == null || this.formData.endDate == undefined || this.formData.endDate == "") {
      this.dobflag2 = true;
    } else {
      this.dobflag2 = false;
    }
  }

  reset() {
    this.formData.startDate = "";
    this.formData.endDate = "";
    this.dateFlag = false;

    this.transactionDetails = this.allPaymentEntries;
    this.dobflag1 = false;
    this.dobflag2 = false;
  }

  getProfileDetails() {
    this.profileInfo = [];
    if (sessionStorage.getItem("customerId") != null && sessionStorage.getItem("customerId") != undefined) {
      let resp = this.profileServicesService.getProfileDetails(sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.profileInfo = data;
      })
    }
  }

  getBill(data) {
    console.log(data);
    
    this.billData = [];
    // console.log(data,"***");
    this.billData.firstName = data.dimBilling.firstName;
    this.billData.lastName = data.dimBilling.lastName;
    this.billData.invoice = data.invoiceId;
    this.billData.date = data.createdAt;
    // this.billData.contact = data.contact;
    this.billData.currency = data.currency;
    this.billData.totalAmount = data.amount;
    this.billData.description = data.description;
    this.billData.country = sessionStorage.getItem("countryCode");
    this.billData.companyName = data.dimBilling.companyName;
    this.billData.address = data.dimBilling.address;
    this.billData.contact = data.dimBilling.mobileCountryCode + " " + data.dimBilling.mobileNumber;

    if (data.billingDetailsSkey != null && data.billingDetailsSkey != '') {
      this.billData.gstin = data.dimBilling.gstinNo;
    }
    else {
      this.billData.gstin = '';
    }
  }

  // downloadImage() {
  //   html2canvas(document.querySelector("#table")).then(canvas => {
  //     var pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height]);
  //     var imgData = canvas.toDataURL("image/jpeg", 5.0);
  //     pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
  //     pdf.save('MarkZil_bill.pdf');
  //   });
  // }

  downloadAsPDF() {
    let resp = this.accountServicesService.createBill(this.billData.invoice);
    resp.subscribe(
      (data: Blob) => {
        var file = new Blob([data], { type: 'application/pdf' })
        var fileURL = URL.createObjectURL(file);

        // if you want to open PDF in new tab
        window.open(fileURL);
        var a = document.createElement('a');
        a.href = fileURL;
        a.target = '_blank';
        // a.download = 'bill.pdf';
        document.body.appendChild(a);
        a.click();
      },
      (error) => {
        // console.log('getPDF error: ', error);

    });

  }



}
