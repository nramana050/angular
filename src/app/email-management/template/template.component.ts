import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import Swal from 'sweetalert2';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { OrderPipe } from 'ngx-order-pipe';

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
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  search;
  private term: string = "";

  //Pagination
  p = 1;
  showData = {
    //rows Per Page
    rowsPerPage: 5
  };

  // Select Process 
  selectFilter = null;
  // Table aray

  userData: any = [];
  form: FormGroup
  //date filter
  dobflag1 = false;
  dobflag2 = false;
  dateFilterFlg = false;
  min1: string;
  min2: string;
  duplicateArray = [];
  editflg = false;
  templateDetails = []
  allListdata: any = [];
  duplicateArr: any = [];
  order: string = 'createdDate';
  reverse: boolean = true;
  activedeactive;
  chkName = '1';


  nodataFlg = false;

  formData = {
    startDate: "",
    endDate: ""
  };

  submitted = false;
  dashboardListInternalList: any;

  ngOnInit(): void {
    this.activedeactive = 1;
    // this.activeDeactive();
  }

  constructor(public datepipe: DatePipe, private previewService: PreviewService, private router: Router, private location: Location, private fb: FormBuilder, private emailManaementService: EmailManaementService, private orderPipe: OrderPipe) {
    this.createForm();
    this.getAllTemplateList();
  }

  redirectToCreateTemplate() {
    this.previewService.campaignRouting = "";
    this.previewService.selecteProcessIdList = null;
    this.router.navigate(['/create-template']);    
  }

  redirectToEdit(templ) {
    this.previewService.campaignRouting = "";
    this.previewService.selecteProcessIdList = JSON.parse(JSON.stringify(templ));
    sessionStorage.setItem("TempClone", null);
    this.router.navigate(['/create-template']);
  }


  onSubmit() { this.submitted = true; }

  createForm() {
    this.form = this.fb.group({
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    }, { validator: this.dateLessThan('dateFrom', 'dateTo') });
  }

  getAllTemplateList() {
    //this.allListdata = [];
    this.duplicateArr = [];
    this.nodataFlg = false;

    let resp = this.emailManaementService.getEmailTeamplateList(sessionStorage.getItem('customerId'));
    resp.subscribe(data => {
      if (data != 0 && data != '' && data.length != 0) {        
        for (let i in data) {
          //this.templateDetails.push(data[i]);
          this.duplicateArr.push(data[i]);
        }
      }
      else{
        this.nodataFlg = true;
      }
      this.getDeleted();
    });
  }

  deleteTempl(templ) {
    templ = JSON.parse(JSON.stringify(templ));
    let msg = "";
    let BtnMsg = "";
    if (templ.status == "1") {
      templ.status = "0";
      msg = "You want to set this template as In-active!";
      BtnMsg = "In-active";
    } else {
      templ.status = "1";
      msg = "You want to set this template as active!";
      BtnMsg = "Active";
    }
    Swal.fire({
      title: 'Are you sure?',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + BtnMsg
    }).then((result) => {
      if (result.isConfirmed) {
        let resp = this.emailManaementService.createEmailTeamplate(templ);
        resp.subscribe(data => {
          if (data == 1 || data == "1") {
            this.getAllTemplateList();
            
          }
          if(this.activedeactive == 0){
            Swal.fire(
              'Active!',
              'This template has been set as active',
              'success'
            )
          }
          else {
            Swal.fire(
              'In-Active!',
              'This template has been set as In-active',
              'success'
            )
          }
          //this.getAllTemplateList();
        });
      }
    })

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

  //date filter
  reverseAndTimeStamp(dateString) {
    let d1 = this.datepipe.transform(dateString, "yyyy-MM-dd");
    return d1;
  }

  filterDate() {
    this.templateDetails = [];

    this.dateValid1();
    this.dateValid2();
    let fr = this.datepipe.transform(this.formData.startDate, "yyyy-MM-ddThh:mm");
    let to = this.datepipe.transform(this.formData.endDate, "yyyy-MM-ddThh:mm");

    if (this.formData.startDate != null && this.formData.startDate != undefined && this.formData.startDate != ""
      && this.formData.endDate != null && this.formData.endDate != undefined && this.formData.endDate != "") {
      this.dateFilterFlg = true;
      let selectedMembers = this.allListdata.filter(f =>
        new Date(this.reverseAndTimeStamp(f.createdDate)) >= new Date(this.formData.startDate)
        && new Date(this.reverseAndTimeStamp(f.createdDate)) <= new Date(this.formData.endDate));
      this.templateDetails = selectedMembers;
    } else {
      this.templateDetails = this.allListdata;
    }
  }

  reset() {
    this.formData.startDate = "";
    this.formData.endDate = "";
    this.dateFilterFlg = false;

    this.templateDetails = this.allListdata;
    this.dobflag1 = false;
    this.dobflag2 = false;
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

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  saveListDetails(userInfo) {
    let resp = this.emailManaementService.createEmailTeamplate(userInfo);
    resp.subscribe(data => {
      this.getAllTemplateList();
    });
  }

  getDeleted() {
    this.templateDetails = [];
    this.allListdata = [];
    //this.duplicateArray = [];
    // if ($("#deleted").is(":checked")) {
    //   this.chkName = "0"
    // } else {
    //   this.chkName = "1"
    // }
  
    this.chkName=this.activedeactive;
    for (let i in this.duplicateArr) {
      if (this.duplicateArr[i].status == this.chkName) {
        this.templateDetails.push(this.duplicateArr[i]);
        this.allListdata.push(this.duplicateArr[i]);
      }
    }
  }

  CloneTemplate(templ, TempClone) {
    this.previewService.campaignRouting = "";
    this.previewService.selecteProcessIdList = templ;
    sessionStorage.setItem("TempClone", TempClone);

    let msg = '';
    let BtnMsg = '';

    msg = "You want to clone this template!";
    BtnMsg = "clone";
    Swal.fire({
      title: 'Are You Sure?',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + BtnMsg + ' it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/create-template']);
      }
    })
  }



  // activeDeactive() {
  //   this.nodataFlg = false;
  //   if (this.activedeactive == 1) {
  //     let resp = this.emailManaementService.getEmailTeamplateList(sessionStorage.getItem('customerId'));
  //     resp.subscribe(data => {
  //       this.templateDetails = [];
  //       if (data != null && data != "") {
  //         for (let i in data) {
  //           if (data[i].status == "1") {
  //             this.templateDetails.push(data[i]);
  //           }
  //         }
  //       } else {
  //         this.nodataFlg = true;
  //       }
  //     });
  //   }
  //   if (this.activedeactive == 2) {
  //     let resp = this.emailManaementService.getEmailTeamplateList(sessionStorage.getItem('customerId'));
  //     resp.subscribe(data => {
  //       this.templateDetails = [];
  //       if (data != null && data != "") {
  //         for (let i in data) {
  //           if (data[i].status == "0") {
  //             this.templateDetails.push(data[i]);
  //           }
  //         }
  //       } else {
  //         this.nodataFlg = true;
  //       }
  //     });

  //   }

  // }
}