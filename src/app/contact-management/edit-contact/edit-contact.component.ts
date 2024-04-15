import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { ConatctServicesService } from '../contact-management-service/conatct-services.service';
import swal from 'sweetalert2';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
declare var $: any
const Toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', swal.stopTimer)
    toast.addEventListener('mouseleave', swal.resumeTimer)
  }
})


@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {

  //Toggle Email ID
  btnName: string = "Edit";
  contactListDetail: any = [];
  campaignList: any = [];
  i;
  mobilecodeList: any;
  campaignFlag = false;
  listFlag = false;
  message: any;
  commingFrom: any;
  dobflag = 0;


  contactInfo: any = {
    originalEmailId: "",
    firstName: "",
    lastName: "",
    dob: "",
    companyName: "",
    city: "",
    mobileNo: "",
    mobileCountryCode: ""
  };



  constructor(private router: Router, private profileServicesService: ProfileServicesService, private previewService: PreviewService, private conatctServicesService: ConatctServicesService) {

    if (this.previewService.commingFrom != null && this.previewService.commingFrom != undefined) {
      this.commingFrom = this.previewService.commingFrom
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('originalEmailId') != null && sessionStorage.getItem('originalEmailId') != undefined && sessionStorage.getItem('originalEmailId') != "") {
      this.EditContact();
      this.mobileCountryCode();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  saveUser(editContact: NgForm) {
    this.saveEditContact(this.contactInfo);
  }

  EditContact() {
    let resp = this.conatctServicesService.getUniqueCustClient(sessionStorage.getItem('originalEmailId'));
    resp.subscribe(data => {
      //console.log(data);
      this.contactInfo = data;
      this.contactInfo.dob = moment(data.dob).format('YYYY-MM-DD');
      this.getListDetails(data.customerClientId, sessionStorage.getItem("customerId"));
      this.getCampaignDetails(data.customerClientId, sessionStorage.getItem("customerId"));
      //console.log(sessionStorage.getItem("customerId"));

    });
  }

  getListDetails(customerClientId, customerId) {
    this.contactListDetail = [];

    let resp = this.conatctServicesService.getClientCustMapList(customerClientId, customerId);
    resp.subscribe(data => {
      if (data.length != 0) {
        this.listFlag = false;
        this.contactListDetail = data;
        
      }
      else {
        this.listFlag = true;
        this.message = "No List to show";

      }

    });
  }

  getCampaignDetails(customerClientId, customerId) {
    this.campaignList = [];
    //console.log(customerClientId,customerId);
    this.contactListDetail = [];
    let resp = this.conatctServicesService.getClientCustMapCampaign(customerClientId, customerId);
    resp.subscribe(data => {
      if (data.length != 0) {
        this.campaignFlag = false;
        this.campaignList = data;
      }
      else {
        this.campaignFlag = true;
        this.message = "No Campaign to show";
      }
     
    });
  }

  saveEditContact(contactInfo) {
    let resp = this.conatctServicesService.saveEditContact(contactInfo);
    resp.subscribe(data => {
      //moment(data.dob).format('YYYY-MM-DD');
      if (data == '1' || data == 1) {
        //if(this.dobflag == 0){
        this.EditContact();
        Toast.fire({
          icon: 'success',
          title: 'Succesfully updated '
        })
        // }else{
        //   swal.fire("Warning!","Date of Birth should be greater or equal to 18")
        // }
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Updation failed '
        })
      }
    });
  }

  mobileCountryCode() {
    let resp = this.conatctServicesService.mobileCountryCode()
    resp.subscribe(data => {
      this.mobilecodeList = data;
    });
  }

  redirectToAllContacts() {
    if (this.commingFrom == "Dashboard") {
      this.commingFrom = "";
      this.router.navigate(['/countall-contacts']);
    } else {
      this.router.navigate(['/all-contacts']);
    }
  }

  compareAge() {
    let dob = this.contactInfo.dob;
    let db = moment(dob).format("YYYY-MM-DD");
    let today = new Date();
    let temp = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    let store = moment(temp).format("YYYY-MM-DD");
    if (db <= store) {
      this.dobflag = 0;
      return {};
    }
    else {
      this.dobflag = 1;

    }
  }
}
