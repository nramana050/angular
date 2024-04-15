import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { NgForm, FormGroup } from '@angular/forms';
import { ConatctServicesService } from '../contact-management-service/conatct-services.service';
import Swal from 'sweetalert2';
import { data } from 'jquery';
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

declare var $: any


@Component({
  selector: 'app-domain-blocker',
  templateUrl: './domain-blocker.component.html',
  styleUrls: ['./domain-blocker.component.css']
})
export class DomainBlockerComponent implements OnInit {

  OriginlistData = [];
  submitFlg = false;
  // Select Process 
  selectFilter = null;

  search;

  //Pagination
  p = 1;

  showData = {
    rowsPerPage: 5
  };

  btnName = "Add";
  headName = "Create Domain Blocklist";
  editMode = false;
  nodataFlg = false;


  userInfo: any = {
    domainName: "",
    description: "",
    customerId: "",
    status: "1",
    domainBlockerSkey: ""
  };

  order: string = 'domainBlockerSkey';
  reverse: boolean = true;

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  constructor(private router: Router, private location: Location, private conatctServicesService: ConatctServicesService, private previewService: PreviewService, private orderPipe: OrderPipe) {
  }

  ngOnInit(): void {
    this.getBlockList();
  }

  // form submit 
  saveUser(userInfo: NgForm) {
    var flg = 0;
    let resp = this.conatctServicesService.checkDuplicateDomain(this.userInfo.domainName, sessionStorage.getItem('customerId'));
    resp.subscribe(data => {
      if (data == '1' || data == 1) {
        flg = 0;
        if(this.editMode==true){
          flg = 1;
        }
      } else {
        flg = 1;
      }

      if(flg==1){
      if (this.userInfo.description == null || this.userInfo.description.length < 255) {
        this.submitFlg = true;
        this.userInfo.customerId = sessionStorage.getItem('customerId');
        let resp = this.conatctServicesService.saveDomainBlocker(this.userInfo);
        resp.subscribe(data => {
          if (data != null && data == '1' || data == 1) {
            this.submitFlg = false;
            if (this.editMode == false) {
              Toast.fire({
                icon: 'success',
                title: 'New domain name added succesfully'
              })
            }
            else {
              Toast.fire({
                icon: 'success',
                title: ' Domain name updated succesfully '
              })
            }
            this.getBlockList();
            this.clear();
          }
        });
        userInfo.resetForm();
      }
    }
    });
}

editUserInfo(data) {
  this.editMode = true;
  this.btnName = "Update";
  this.headName = "Update Domain BlockList";
  this.userInfo = JSON.parse(JSON.stringify(data));
}

getBlockList() {
  this.nodataFlg = false;
  this.OriginlistData = [];
  let resp = this.conatctServicesService.getDomainBlockList(sessionStorage.getItem("customerId"));
  resp.subscribe(data => {
    if (data != null && data != '' && data.length != 0) {
      this.OriginlistData = data;
    } else {
      this.nodataFlg = true;
    }
  });
}

removeFromBlock(data) {
  this.clear();
  let msg = "You want to remove this domain from blacklist!";
  let BtnMsg = "Remove";
  Swal.fire({
    title: 'Are you sure?',
    text: msg,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, ' + BtnMsg + ' it!'
  }).then((result) => {
    if (result.isConfirmed) {
      let resp = this.conatctServicesService.deleteDomainBlockList(data.domainBlockerSkey);
      resp.subscribe(data => {
        this.getBlockList();
      });
      Swal.fire(
        'Removed!',
        'This domain has been removed',
        'success'
      )
    }
  })
}

clear() {
  this.editMode = false;
  this.btnName = "Add";
  this.headName = "Create Domain BlockList";
  this.userInfo.domainBlockerSkey = "";
}

clearcancel() {
  this.editMode = false;
  this.btnName = "Add";
  this.headName = "Create Domain BlockList";
  this.userInfo.description = "";
  this.userInfo.domainName = "";
  this.userInfo.domainBlockerSkey = "";
}

setOrder(value: string) {
  if (this.order === value) {
    this.reverse = !this.reverse;
  }
  this.order = value;
}

gotoTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

checkDuplicateDomain() {
  let resp = this.conatctServicesService.checkDuplicateDomain(this.userInfo.domainName, sessionStorage.getItem('customerId'));
  resp.subscribe(data => {
    if (data == '1' || data == 1) {
      Swal.fire("Domain name already available!");
      this.userInfo.domainName = "";
    }
  });
}

}

