import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { NgForm, FormGroup } from '@angular/forms';
import { AuthServicesService } from '../auth-services/auth-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  
  show_button: Boolean = false;
  show_button1: Boolean = false;
  show_eye: Boolean = false;
  show_eye1: Boolean = false;

  errorFlag = false;

  forgot = {
    requestURI:'',
    userName:''
  }
  value: any;
  skey: any;

  //Function
 

  user = {
    email: "",
    custIdKey: '',
    custId: '',
    userId:'',
    password: "",
    password1: "",
    userUniqueKey:'',
    userName:'',
    oldPassword1:''
  };

  constructor(private router: Router,private location: Location,private authServicesService:AuthServicesService) { }

  countryCode: any;
  country: any;
  ngOnInit(): void {
    this.value = (window.location.href).split("?"); 
  
    this.user.email = this.value[1].split(":")[1]
      .split("%20")[0]; 
    this.skey = this.value[1]
      .split(":")[2];
    this.user.custIdKey = this.skey.replace('=', '');
   this.emailCheckgenratepassword();
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  showPassword1() {
    this.show_button1 = !this.show_button1;
    this.show_eye1 = !this.show_eye1;
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('password').value;
    return pass === confirmPass ? null : { notSame: true }
  }


  emailCheckgenratepassword() {
    this.user.userUniqueKey=this.user.custIdKey;
    this.user.userName=this.user.email;
    let resp = this.authServicesService.emailCheckgenratepassword(this.user);
    resp.subscribe((data) => { 
      if (data >= 1) {
        this.errorFlag = false;
        this.user.custId = data;  
      } else {
        this.errorFlag = true;
      }
    });

  }

  genratePassword(genratePasswordform: NgForm) {
    this.user.userUniqueKey=this.user.custIdKey;
    this.user.oldPassword1=this.user.password;
    this.user.userName=this.user.email;
    this.user.userId=this.user.custId ;
  
  let resp = this.authServicesService.genratePassword(this.user);
    resp.subscribe((data) => {
      genratePasswordform.reset();
      this.authServicesService.redirectToLogin();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Password Reset Successfully',
        showConfirmButton: false,
        timer: 4500
      })
    });
  }


  // forgot link

  forgotPass() {
    this.forgot.userName = this.user.email;
    this.forgot.requestURI=this.value[0];

    let resp = this.authServicesService.forgotPass(this.forgot);
    resp.subscribe((data) => {

      if (data != null && data != "" && data != 0) {
        this.authServicesService.redirectToLogin();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'The Reset Password link send on your email address!',
          showConfirmButton: false,
          timer: 4500
        })
      }

    });
   
  }

}
