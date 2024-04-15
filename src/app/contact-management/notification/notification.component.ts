import { Component,HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm, FormGroup } from '@angular/forms';
import { Location, DatePipe } from "@angular/common";
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConatctServicesService } from '../contact-management-service/conatct-services.service';
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
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  reverse: boolean = true;

  order: string = 'emailExceptionSkey';
  form: FormGroup
  activedeactive;
  notificationData: any = {
    description: "",
    emailId: "",
  };
  OriginlistData: any;
  btnName = "Add";
  pageName = "Create Notification Receiver"
  nodataFlg = false;
  OriginalNOtificationList :any=[];
  
  submitFlg=false;
  search;

  //Pagination
  p = 1;

  showData = {
    rowsPerPage: 5
  };

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  constructor(public datepipe: DatePipe, private router: Router, private location: Location, private fb: FormBuilder, private conatctServicesService: ConatctServicesService) { }

  ngOnInit(): void {
    this.activedeactive = '1';
    this.getEmailNotification();

  }

  saveNotification(notificationForm: NgForm) {
    if (this.notificationData.description == null || this.notificationData.description.length < 254 ) {
      this. submitFlg=true;
      this.notificationData.customerId = sessionStorage.getItem('customerId');
      if (this.notificationData.status != 0) {
        this.notificationData.status = "1";
      }
      let resp = this.conatctServicesService.sendEmailNotification(this.notificationData);
      resp.subscribe(data => {
        if (data != null && data == '1' || data == 1) {
          this. submitFlg=false;
          if (this.btnName == "Add") {
            Toast.fire({
              icon: 'success',
              title: 'Notification added succesfully'
            })
          }
          else {
            Toast.fire({
              icon: 'success',
              title: ' Notification updated succesfully '
            })
          }
          this.clear();
          notificationForm.resetForm();
        }
        this.getEmailNotification();
      });
    }
  }

  clearnotificationForm() {
    this.btnName = "Add";
    this.pageName = "Create Notification Reciever"
    this.notificationData.emailId = "";
    this.notificationData.description = "";
    this.notificationData.emailExceptionSkey="";
  }

  clear(){
    this.notificationData.emailId = "";
    this.notificationData.description = "";
    this.notificationData.emailExceptionSkey="";
    this.btnName = "Add";
    this.pageName = "Create Notification Reciever"
  }

  // unique notification

  getUniqueEmailNoti(emailId) {

    let resp = this.conatctServicesService.getUniqueEmailNoti(emailId, sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null && data != '') {
        this.notificationData.emailId = "";
        Swal.fire("Email id already exists!");
      }
    });
  }

  editNotificationInfo(notification) {
    this.btnName = "Update";
    this.pageName = "Edit Notification Reciever"
    this.notificationData = JSON.parse(JSON.stringify(notification));
  }



  getEmailNotification() {
      let resp = this.conatctServicesService.getEmailNotification(sessionStorage.getItem("customerId"));
      resp.subscribe(data => { 
        this.OriginlistData = [];
        if (data != '' && data != null && data.length != 0) {
          this.OriginlistData = data;
          this.OriginalNOtificationList = data;
          this.filter();
          this.nodataFlg = false;

        }  
        else{
          this.nodataFlg = true;
        }
      });
  }

  activeDeactiveNotification(value, notification) {
    this.clearnotificationForm();
    notification = JSON.parse(JSON.stringify(notification));
    let msg = '';
    let BtnMsg = '';
    if (value == "active") {
      msg = "You want to set this notification as active!";
      BtnMsg = "Active";
    } else {      
      msg = "You want to set this notification as In-active!";
      BtnMsg = "In-active";
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
        if (value == "active") {
          notification.status = "1";
        } else {
          notification.status = "0";          
        }

        let resp = this.conatctServicesService.sendEmailNotification(notification);
        resp.subscribe(data => {
          if (data != null && data == '1' || data == 1) {

            if (value == "active") {
              Swal.fire(
                'Active!',
                'This notification has been set as active',
                'success'
              )
            }
            else {
              Swal.fire(
                'In-Active!',
                'This notification has been set as In-active',
                'success'
              )
            }
            this.getEmailNotification();
          }
        });

      }
    })

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

  filter(){
    this.OriginlistData = [];
      for(let i in this.OriginalNOtificationList){
        if(this.activedeactive == "0" && this.OriginalNOtificationList[i].status=="0"){
          this.OriginlistData.push(this.OriginalNOtificationList[i]);
        }
        else if(this.activedeactive == "1" && this.OriginalNOtificationList[i].status=="1"){
          this.OriginlistData.push(this.OriginalNOtificationList[i]);
        }
      }
  }

}
