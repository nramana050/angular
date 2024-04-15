import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { NgForm, FormGroup } from '@angular/forms';
import { AuthServicesService } from '../auth-services/auth-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  requestURI:any
  registerUserFlag=false;
  forgotpswdInfo: any = {
    email: "",
    requestURI: ''
  }
  submitFlg=false;

  ngOnInit(): void {
    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace("forgot-password", "reset-password")
    this.requestURI = currentUrl;
  }

  redirectTosignin(){
    this.authServicesService.redirectToLogin();
  }

  constructor( private router: Router,private location: Location ,private authServicesService: AuthServicesService) { }
  forgotPassword(forgotpswd: NgForm) {
    this.submitFlg=true;
   this.forgotpswdInfo.userName=this.forgotpswdInfo.email;
  this.forgotpswdInfo.requestURI=this.requestURI;
  let resp = this.authServicesService.forgotPass(this.forgotpswdInfo);
    resp.subscribe((data) => {
      if (data != null && data != "" && data != 0) {
        this.registerUserFlag = false;
        this.submitFlg=false;
        this.authServicesService.redirectToLogin();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'The reset password link sent to your email address',
          showConfirmButton: false,
          timer: 4500
        })
      } else {
        this.registerUserFlag = true;

      }

    });
}

// user name Text box space remove function 
onKeydown(event) {
  if (event.keyCode === 32) {
    return false;
  }
}

emailCheckUnique(email) {
  let resp = this.authServicesService.checkEmailDuplication(email);
  resp.subscribe((data) => {
    if (data == 0) {
      this.registerUserFlag = false;
    } else {
      this.registerUserFlag = true;
    }
  });

}

}
