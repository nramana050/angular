import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm, FormGroup } from '@angular/forms';
import { Location, DatePipe } from "@angular/common";
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { ConatctServicesService } from '../contact-management-service/conatct-services.service';
import Swal from 'sweetalert2';
import { OrderPipe } from 'ngx-order-pipe';
import { AccountServicesService } from 'src/app/account-management/account-services/account-services.service';

declare var $: any

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
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
})
export class FileDetailsComponent implements OnInit {
  @ViewChild('closenewListModal') closenewListModal: ElementRef;
  submitFlg = false;
  order: string = 'listId';
  reverse: boolean = true;
  rdobtnShow = false;
  search;
  fileName: any;
  previewDatList = [];
  listData = [];
  balance: any = [];
  isShowDiv = false;
  showList = false;
  listrdidata: any = {
    listId: ""
  }

  listInfo: any = {
    listDescription: "",
    listName: "",
  };

  //Pagination
  p = 1;
  showData = {
    //rows Per Page
    rowsPerPage: 5
  };

  userData: any = [{ id: "01", listname: "Tachotax ", contacts: "9856478569", date: "12 Apr 2001" },
  { id: "02", listname: "Tachotax ", contacts: "9856478569", date: "12 Apr 2001" },
  { id: "03", listname: "Tachotax ", contacts: "9856478569", date: "12 Apr 2020" }];

  constructor(private router: Router, private location: Location, private previewService: PreviewService, private conatctServicesService: ConatctServicesService, private orderPipe: OrderPipe, private accountServicesService: AccountServicesService) { }

  ngOnInit(): void {
    if (this.previewService.getFileData != null && this.previewService.getFileData != undefined
      && this.previewService.getPreviewList != null && this.previewService.getPreviewList != undefined) {
      this.previewDatList = this.previewService.getPreviewList;
      this.fileName = this.previewService.getFileData.name;
    } else {
      this.router.navigate(['/import-contact']);
    }
    this.getAllListDetails(null);
    this.getBalanceDetails();
  }

  getAllListDetails(skey) {
    this.listData = [];
    let resp = this.conatctServicesService.getAllListDetails(sessionStorage.getItem('customerId'));
    resp.subscribe(data => {
      if (data != null || data != '') {
        for (let i in data) {
          if (data[i].status == '1') {
            this.listData.push(data[i]);
          }
        }
        if (skey != null) {
          this.listrdidata.listId = skey;
        }
      }
    });
  }

  checkDuplicateList() {

    let resp = this.conatctServicesService.checkDuplicateList(this.listInfo.listName, sessionStorage.getItem('customerId'));
    resp.subscribe(data => {

      if (data == '1' || data == 1) {
        Swal.fire("List name already exists!");
        this.listInfo.listName = "";
      }
    });
  }


  saveListDetails(listInfo) {
    this.rdobtnShow = false;
    this.submitFlg = true;
    let resp = this.conatctServicesService.createList(listInfo);
    resp.subscribe(data => {
      if (data == null && data == 0 && data == '0') {

      } else {
        this.getAllListDetails(data);
        this.listInfo.listName = "";
        this.listInfo.listDescription = "";
        this.rdobtnShow = true;
      }
      this.submitFlg = false;
    });
  }
  // form submit 
  saveList(createList: NgForm) {
    this.closenewListModal.nativeElement.click();
    document.getElementById('newList').click();
    //this.isShowDiv = !this.isShowDiv;
    this.isShowDiv = true;
    this.showList = !this.showList;
    this.listInfo.customerId = sessionStorage.getItem('customerId');
    if (this.listInfo.listName != null && this.listInfo.listName != undefined && this.listInfo.listName != "") {
      this.saveListDetails(this.listInfo);
    }
    createList.resetForm();
    //this.showList = true;
  }

  redirectToCreateList() {
    this.router.navigate(['/create-list']);
  }

  // EDIT/UPDATE BUTTON TOGGLE 
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  getBalanceDetails(){
    let resp = this.accountServicesService.getBalanceDetails(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null) {
        this.balance = data;
        // console.log(this.balance.dimProduct.productName);
      }
    });
  }

  uploadFile() {
    if (this.listrdidata.listId != null && this.listrdidata.listId != undefined && this.listrdidata.listId != "") {
      if (this.balance.length != 0 && this.balance != null && this.balance != undefined) {
        Swal.fire({
          title: 'Do you want to verify email address?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: `Yes`,
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {
            let resp = this.conatctServicesService.verifiyFile(this.previewService.getFileData, this.previewService.getPreviewList[0], sessionStorage.getItem("customerId"), this.listrdidata.listId);
            resp.subscribe((data) => {
            });
            Swal.fire({
              position: 'center',
              title: 'Contact verification is in progress',
            }).then(okay => {
              if (okay) {
                this.router.navigate(['/create-list']);
              }
            });
          } else if (result.isDenied) {
            let resp = this.conatctServicesService.uploadFile(this.previewService.getFileData, this.previewService.getPreviewList[0], sessionStorage.getItem("customerId"), this.listrdidata.listId);
            resp.subscribe((data) => {
            });
            Swal.fire({
              position: 'center',
              title: 'Contact upload is in progress',
            }).then(okay => {
              if (okay) {
                this.router.navigate(['/create-list']);
              }
            });
          } else if (result.isDismissed) {
            //stay on same page
          }
        })
      }
      else {
        let resp = this.conatctServicesService.uploadFile(this.previewService.getFileData, this.previewService.getPreviewList[0], sessionStorage.getItem("customerId"), this.listrdidata.listId);
        resp.subscribe((data) => {
        });
        Swal.fire({
          position: 'center',
          title: 'Contact upload is in progress',
        }).then(okay => {
          if (okay) {
            this.router.navigate(['/create-list']);
          }
        });
      }
    } else {
      Swal.fire("Please select list!");
    }

  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  getCount(data) {
    if (data.contactCount > 20000) {
      if ($("#listId").prop("checked", true)) {
        $("#listId").prop("checked", false)
      }
      else {
        $("#listId").prop("checked", false)
      }
      Swal.fire("This list is full!")
      this.listrdidata.listId = "";
    }
  }
}
