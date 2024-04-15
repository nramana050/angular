import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { NgForm, FormGroup } from '@angular/forms';
import { AuthServicesService } from '../auth-services/auth-services.service';
import Swal from 'sweetalert2';
import { ConatctServicesService } from 'src/app/contact-management/contact-management-service/conatct-services.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  douplicate = false;
  signupInfo: any = {
    email: "",
    fname: "",
    lname: "",
    newPassword: "",
    password1: "",
    mobileNumber: "",
    mobileCountryCode: "",
    countryCode: ""
  }

  submitFlg = false;
  mobilecodeList: any;
  countryCodeList: any = [91,90];

  constructor(private router: Router, private location: Location, private authServicesService: AuthServicesService, private conatctServicesService: ConatctServicesService) { }

  ngOnInit(): void {
    this.mobileCountryCode();
  }

  // user name Text box space remove function 
  onKeydown(event) {
    if (event.keyCode === 32) {
      return false;
    }
  }
  checkEmailDuplication() {
    this.douplicate = false;
    let resp = this.authServicesService.checkEmailDuplication(this.signupInfo.email);
    resp.subscribe((data) => {
      if (data == 0) {
        this.douplicate = true;
      }
    });
  }

  saveUser(signupForm: NgForm) {
    this.submitFlg = true;
    this.signupInfo.userName = this.signupInfo.email;
    this.signupInfo.userFirstName = this.signupInfo.fname;
    this.signupInfo.userLastName = this.signupInfo.lname;
    this.signupInfo.oldPassword1 = this.signupInfo.newPassword;
    this.signupInfo.mobileCountryCode = this.signupInfo.mobileCountryCode;
    this.signupInfo.mobileNumber = this.signupInfo.mobileNumber;
    this.signupInfo.countryCode = this.signupInfo.countryCode;
    let resp = this.authServicesService.signUp(this.signupInfo);
    resp.subscribe((data) => {
      signupForm.reset();
      this.submitFlg = false;
      this.authServicesService.redirectToLogin();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'You have registered successfully!',
        showConfirmButton: false,
        timer: 4500
      })
    });

  }
  redirectToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  redirectToSignIn() {
    this.authServicesService.redirectToLogin();
  }

  // variable
  show_button: Boolean = false;
  show_confirmbutton: Boolean = false;
  show_eye: Boolean = false;
  show_eye1: Boolean = false;

  //Function
  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  showconfirmPassword() {
    this.show_confirmbutton = !this.show_confirmbutton;
    this.show_eye1 = !this.show_eye1;
  }

  mobileCountryCode() {
    this.countryCodeList = [91,90]
    let resp = this.conatctServicesService.mobileCountryCode()
    resp.subscribe(data => {
      this.mobilecodeList = data;
      for (let i in data) {
        if (data[i].countryFlag != null && data[i].countryFlag != 'NULL' && data[i].countryFlag != undefined && data[i].countryFlag != '') {
          this.countryCodeList.push(data[i]);
        }
      }
    });

  }

}
