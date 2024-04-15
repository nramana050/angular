import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import Swal from 'sweetalert2';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  selector: 'app-process-management',
  templateUrl: './process-management.component.html',
  styleUrls: ['./process-management.component.css']
})
export class ProcessManagementComponent implements OnInit {

  dashboardListInternalList: any[];
  OriginlistData = [];
  selecteProcessIdList: any;
  search;
  activedeactive;
  private term: string = "";
  i;
  //Pagination
  p = 1;
  nodataFlg = false;

  showData = {
    //rows Per Page
    rowsPerPage: 5
  };

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
  processDetails = [];
  allProcessList: any = [];
  order: string = 'processSkey';
  reverse: boolean = true;



  formData = {
    startDate: "",
    endDate: ""
  };

  submitted = false;

  //@Output() changed = new EventEmitter<boolean>();

  constructor(public datepipe: DatePipe, private router: Router, private location: Location, private fb: FormBuilder, private emailservice: EmailManaementService, private previewService: PreviewService, private orderPipe: OrderPipe) {
    this.createForm();
  }

  ngOnInit(): void {
    this.processDetails = this.userData
    //  this.getAllProcessDetails();
    this.activedeactive = 1;
    this.activeDeactive();
    this.minAgeTo();
    this.minAgeFrom();
  }

  onSubmit() { this.submitted = true; }

  redirectToCreateProcessplus() {
    this.previewService.selecteProcessIdList = "";
    this.previewService.campaignRouting = "";
    this.router.navigate(['/create-process']);
  }

  redirectToCreateprocess(i, processSkey) {
    this.selecteProcessIdList = {};
    for (let i in this.OriginlistData) {
      if (this.OriginlistData[i].processSkey == processSkey) {
        this.selecteProcessIdList = this.OriginlistData[i];
      }
    }
    this.previewService.selecteProcessIdList = this.selecteProcessIdList;

    this.router.navigate(['/create-process']);
  }

  createForm() {
    this.form = this.fb.group({
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    }, { validator: this.dateLessThan('dateFrom', 'dateTo') });
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

    this.OriginlistData = [];

    this.dateValid1();
    this.dateValid2();

    let fr = this.datepipe.transform(this.formData.startDate, "yyyy-MM-ddThh:mm");
    let to = this.datepipe.transform(this.formData.endDate, "yyyy-MM-ddThh:mm");

    if (this.formData.startDate != null && this.formData.startDate != undefined && this.formData.startDate != ""
      && this.formData.endDate != null && this.formData.endDate != undefined && this.formData.endDate != "") {
      this.dateFilterFlg = true;
      let selectedMembers = this.allProcessList.filter(f =>
        new Date(this.reverseAndTimeStamp(f.createdDate)) >= new Date(this.formData.startDate)
        && new Date(this.reverseAndTimeStamp(f.createdDate)) <= new Date(this.formData.endDate));

      this.OriginlistData = selectedMembers
    }
    else {
      this.OriginlistData = this.allProcessList
    }
  }

  minAgeTo() {
    let today = new Date();
    var tod = moment(today).format("DD-MM-YYYY");
    let temp = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    this.min1 = moment(temp).format("YYYY-MM-DD");
  }
  minAgeFrom() {
    let today = new Date();
    var tod = moment(today).format("DD-MM-YYYY");
    let temp = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.min2 = moment(temp).format("YYYY-MM-DD");
  }


  reset() {
    this.formData.startDate = "";
    this.formData.endDate = "";
    this.OriginlistData = this.allProcessList;
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

  // api integration

  getAllProcessDetails() {
    // this.nodataFlg = false;
    let resp = this.emailservice.getAllProcessList();
    resp.subscribe(data => {
      // console.log(data, "-----");

      if (data != 0) {
        for (let i in data) {
          if (data[i].status == '1') {
            this.OriginlistData.push(data[i]);
          }
        }
      }
    });


  }

  saveListDetails(process) {
    let resp = this.emailservice.saveCreateProcess(process);
    resp.subscribe(data => {
      this.activeDeactive();

    });

  }
  deleteProcess(process) {

    process = JSON.parse(JSON.stringify(process));
    let msg = '';
    let BtnMsg = '';
    if (process.status == '1') {
      process.status = '0';
      msg = "You want to set this process as In-active!";
      BtnMsg = "In-active";
    } else {
      msg = "You want to set this process as active!";
      process.status = '1';
      BtnMsg = "Active";
    }
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
        process.customerId = sessionStorage.getItem('customerId');
        this.saveListDetails(process);

        if (process.status == '1') {
          Swal.fire(
            'Active!',
            'This process has been set as active',
            'success'
          )
        } else {
          Swal.fire(
            'In-Active!',
            'This process has been set as In-active',
            'success'
          )
        }
      }
    })

  }

  // active deactive dropdown

  activeDeactive() {
    this.nodataFlg = false;
    if (this.activedeactive == 1) {
     
      let resp = this.emailservice.getAllProcessList();
      resp.subscribe(data => {
        this.OriginlistData = [];
        if (data != 0) {
          for (let i in data) {
            if (data[i].status == '1') {
              this.OriginlistData.push(data[i]);
              this.allProcessList.push(data[i]);
            }
          }
        } else {
          this.nodataFlg = true;
        }
      });
    }
    if (this.activedeactive == 2) {
    
      let resp = this.emailservice.getAllProcessList();
      resp.subscribe(data => {
        this.OriginlistData = [];
        if (data != 0) {
          for (let i in data) {
            if (data[i].status == '0') {
              this.OriginlistData.push(data[i]);
              this.allProcessList.push(data[i]);
            }
          }
        } else {
          this.nodataFlg = true;
        }
      });
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

}
