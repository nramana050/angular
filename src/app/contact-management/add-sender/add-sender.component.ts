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
  selector: 'app-add-sender',
  templateUrl: './add-sender.component.html',
  styleUrls: ['./add-sender.component.css']
})
export class AddSenderComponent implements OnInit {
  nodataFlg = false;
  listData = [];
  OriginlistData = [];
  verificationStatus: any;
  status: any;
  senderId: any;
  editMode = 0;
  btnName: string = "Add";
  headName: string = "Add Sender";
  chkName = '1';
   orignalNewDomain="";

  submitFlg = false;

  // Select Process 
  selectFilter = null;
  filter = ['Filter-1', 'Filter-2', 'Filter-3', 'Filter-4'];

  search;
  private term: string = "";
  changeFlg = false;
  selectedallContactList: any = [];

  //Pagination
  p = 1;

  showData = {
    rowsPerPage: 5
  };

  userInfo: any = {
    fromName: "",
    emailAddress: "",
    verificationStatus: "",
    customerId: "",
    newDomain: ""
  };
  campaignRouting: any;
  campProcessData: any;

  order: string = 'senderId';
  reverse: boolean = true;
  hideCancleBtn = false;
  activedeactive;
  campProcessRouting: any = [];

  @HostListener('window:scroll')
  checkScroll() {

    // window의 scroll top
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  }

  constructor(private router: Router, private location: Location, private conatctServicesService: ConatctServicesService, private previewService: PreviewService, private orderPipe: OrderPipe) {
    if (this.previewService.campaignRouting != null && this.previewService.campaignRouting != undefined && this.previewService.campaignRouting != "" && this.previewService.selectedCampaignIdListRouting != null && this.previewService.selectedroutingList != null) {
      this.campaignRouting = this.previewService.campaignRouting;
      this.campProcessData = this.previewService.selectedCampaignIdListRouting;
      this.campProcessRouting = this.previewService.selectedroutingList;
      this.hideCancleBtn = true;
    } else {
      this.hideCancleBtn = false;
    }
  }

  ngOnInit(): void {
    this.getAllSenderDetails();
    this.activedeactive = 1;
    // this.activeDeactive();
  }

  RedirecttoCamp() {
    if (this.campaignRouting == "campDashboard") {
      this.previewService.selectedCampaignIdListRouting = this.campProcessData;
      this.previewService.selectedroutingList = this.campProcessRouting;
      this.router.navigate(['/create-campaign']);
    }
    else {
      this.cancelClear();
    }
  }

  // form submit 
  saveUser(addSender: NgForm) {

    // console.log( this.userInfo.newDomain,"============================");
    
    var flg = 0;
    let resp = this.conatctServicesService.checkDuplicateSender(sessionStorage.getItem("customerId"), this.userInfo.emailAddress);
    resp.subscribe(data => {
      if (data == '1' || data == 1) {
        flg = 0;
        if (this.editMode == 1) {
          flg = 1;
        }
      } else {
        flg = 1;
      }
      if (flg == 1) {
        this.submitFlg = true;
        this.userInfo.customerId = sessionStorage.getItem('customerId');
        // this.createSender(this.userInfo);
        this.changeFlg = false;
        if (this.userInfo.newDomain=="Y" ) {
          this.userInfo.newDomain = "Y";
        }
        if (this.userInfo.newDomain==="No" ) {
          this.userInfo.newDomain = null;
        }
        if (this.userInfo.newDomain=="N" ) {
          this.userInfo.newDomain = "N";
        }

        if (this.editMode == 0) {
              
              
                  let resp = this.conatctServicesService.createSender(this.userInfo);
                  resp.subscribe(data => {
                    if (data != null || data == 1 || data == '1') {
                      this.submitFlg = false;
                      if (this.editMode == 0) {
                        Toast.fire({
                          icon: 'success',
                          title: 'New sender added successfully '
                        })
                      }
                      this.getAllSenderDetails();
                      // this.activeDeactive();
                      addSender.resetForm();
                      this.clear();
                      if (this.campaignRouting == "campDashboard") {
                        this.previewService.selectedCampaignIdListRouting = this.campProcessData;
                        this.previewService.selectedroutingList = this.campProcessRouting;
                        this.router.navigate(['/create-campaign']);
                      }
                    }
                  });
              //   }
              // });
           
         
        }
        else {
          if (this.editMode != 0) {
           if(this.userInfo.newDomain!= this.orignalNewDomain){
            this.userInfo.day="1";
            this.userInfo.lastUpdated=null;
           }
          }

          let resp = this.conatctServicesService.createSender(this.userInfo);
          resp.subscribe(data => {
            if (data != null || data == 1 || data == '1') {
              this.submitFlg = false;
              if (this.editMode == 0) {
                Toast.fire({
                  icon: 'success',
                  title: 'New sender added successfully '
                })
              }
              else {
                Toast.fire({
                  icon: 'success',
                  title: ' Sender updated successfully '
                })
              }
              this.getAllSenderDetails();
              // this.activeDeactive();
              addSender.resetForm();
              this.clear();
              if (this.campaignRouting == "campDashboard") {
                this.previewService.selectedCampaignIdListRouting = this.campProcessData;
                this.previewService.selectedroutingList = this.campProcessRouting;
                this.router.navigate(['/create-campaign']);
              }
            }
          });
        }
      }
    });
  }

  getAllSenderDetails() {
    this.nodataFlg = false;

    let resp = this.conatctServicesService.getAllSenderDetails(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null && data != '' && data.length != 0) {
        this.listData = data;
        for (let i in data) {
          if (data[i].status == '1') {
            this.OriginlistData.push(data[i]);
          }
        }
      }
      else {
        this.nodataFlg = true;
      }
      this.getDeleted();
    });
  }

  checkDuplicateSender(event: any) {
    let resp = this.conatctServicesService.checkDuplicateSender(sessionStorage.getItem("customerId"), this.userInfo.emailAddress);
    resp.subscribe(data => {
      if (data == '1' || data == 1) {
        Swal.fire("This email address already exists!");
        this.userInfo.emailAddress = "";
      }
    });
  }

  editUserInfo(data) {
    this.changeFlg = true;
    this.editMode = 1;
    this.btnName = "Update";
    this.headName = "Edit Sender"
    this.orignalNewDomain=JSON.parse(JSON.stringify(data)).newDomain;
    this.userInfo = JSON.parse(JSON.stringify(data));
    if (this.userInfo.newDomain==null ) {
      this.userInfo.newDomain = "No";
    }
  }

  clear() {
    this.userInfo.fromName = "";
    this.userInfo.emailAddress = "";
    this.userInfo.customerId = "";
    this.userInfo.senderId = "";
    this.userInfo.senderSkey = "";
    this.editMode = 0;
    this.orignalNewDomain="";
    this.btnName = "Add";
    this.headName = "Add Sender";
  }

  cancelClear() {
    this.changeFlg = false;
    this.userInfo.emailAddress = "";
    this.userInfo.fromName = "";
    this.userInfo.customerId = "";
    this.userInfo.senderId = "";
    this.userInfo.senderSkey = "";
    this.userInfo.newDomain = "";
    this.editMode = 0;
    this.btnName = "Add";
    this.headName = "Add Sender";
  }

  deleteList(list) {
    this.cancelClear();

    list = JSON.parse(JSON.stringify(list));
    let msg = '';
    let BtnMsg = '';
    if (list.status == '1') {
      list.status = '0';
      msg = "You want to set this sender as In-active!";
      BtnMsg = "In-active";
    } else {
      msg = "You want to set this sender as active!";
      list.status = '1';
      BtnMsg = "Active";
    }
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
        list.customerId = sessionStorage.getItem('customerId');
        let resp = this.conatctServicesService.createSender(list);
        resp.subscribe(data => {
          // this.activeDeactive();
          this.getAllSenderDetails();
        });
        // this.getDeleted();
        if (list.status == '1') {
          Swal.fire(
            'Active!',
            'This sender has been set as active',
            'success'
          )
        } else {
          Swal.fire(
            'In-Active!',
            'This sender has been set as In-active',
            'success'
          )
        }
      }
    })
  }

  getDeleted() {
    this.OriginlistData = [];
    // if ($("#deleted").is(":checked")) {
    //   this.chkName = "0"
    // } else {
    //   this.chkName = "1"
    // }
    this.chkName = this.activedeactive;
    for (let i in this.listData) {
      if (this.listData[i].status == this.chkName) {
        this.OriginlistData.push(this.listData[i]);
      }
    }
  }

  redirectToaddSender() {
    this.router.navigate(['/add-sender']);
  }

  redirectToImportContact() {
    this.router.navigate(['/import-contact']);
  }

  senderVerficationMail(i, userInfo) {
    this.selectedallContactList = [];
    for (let i in this.OriginlistData) {
      this.selectedallContactList = this.OriginlistData[i];
    }
    let resp = this.conatctServicesService.senderVerficationMail(userInfo);
    resp.subscribe(res => {
      Swal.fire("Verification link has been sent to your email address!");
      if (this.campaignRouting == "campDashboard") {
        this.router.navigate(['/campaign-management']);
      }
    });

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

  // activeDeactive() {
  //   this.nodataFlg = false;
  //   if (this.activedeactive == 1) {
  //     let resp = this.conatctServicesService.getAllSenderDetails(sessionStorage.getItem("customerId"));
  //     resp.subscribe(data => {
  //       this.OriginlistData = [];
  //       if (data != 0 && data != null && data != "") {
  //         this.listData = data;
  //         for (let i in data) {
  //           if (data[i].status == '1') {
  //             this.OriginlistData.push(data[i]);
  //           }
  //         }
  //       } else {
  //         this.nodataFlg = true;
  //       }
  //     });
  //   }
  //   if (this.activedeactive == 2) {
  //     let resp = this.conatctServicesService.getAllSenderDetails(sessionStorage.getItem("customerId"));
  //     resp.subscribe(data => {
  //       this.OriginlistData = [];
  //       if (data != 0 && data != null && data != "") {
  //         this.listData = data;
  //         for (let i in data) {
  //           if (data[i].status == '0') {
  //             this.OriginlistData.push(data[i]);
  //           }
  //         }
  //       } else {
  //         this.nodataFlg = true;
  //       }
  //     });

  //   }

  // }

}
