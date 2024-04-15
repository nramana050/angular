import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { AuthServicesService } from 'src/app/auth/auth-services/auth-services.service';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
import swal from 'sweetalert2';
import { IfStmt } from '@angular/compiler';
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
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  contact: any = [];
  submitFlg=false;


  contactUsData = {
    subjectLine: "",
    desc: "",
    email: "",
    firstName: "",
    lastName: "",
    customerId: "",
    customerSkey: ""

  };


  constructor(private authServicesService: AuthServicesService, private profileServicesService: ProfileServicesService) { }

  ngOnInit(): void {

  }

  saveUser(contactUsForm: NgForm) {
    this.submitFlg=true;

    this.contactUsData.email = sessionStorage.getItem("email");
    this.contactUsData.firstName = sessionStorage.getItem("firstName");
    this.contactUsData.lastName = sessionStorage.getItem("lastName");
    this.contactUsData.customerId = sessionStorage.getItem("customerId");
    this.contactUsData.customerSkey = sessionStorage.getItem("customerSkey");
    let resp = this.authServicesService.saveContactUs(this.contactUsData);

    resp.subscribe(data => { 
      this.submitFlg=false;
      swal.fire('Our Team will contact you soon');
      contactUsForm.resetForm();
    });
  }
}
