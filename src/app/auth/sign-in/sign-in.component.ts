import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, DatePipe, formatDate } from "@angular/common";
import { NgForm, FormGroup } from '@angular/forms';
import { AuthServicesService } from '../auth-services/auth-services.service';
import swal from 'sweetalert2';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { promise } from 'protractor';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { HttpErrorResponse } from '@angular/common/http';

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
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  login: boolean;
  SeesionIdDate: any;
  ImageSource: any;

  dailySessionInfo = {
    customerId: "",
    firstName: "",
    lastName: "",
    signIn: "",
    currentStatus: "",
    lastModifiedOn: "",
    comingFrom: "",
    ipAddress: "",
    sessionId: "",
    countryCode: ""
  }

  apDetails: any;
  signinInfo = {
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  }
  currentDate: any;
  ip: any;
  ipAddress: any;


  redirectToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  constructor(private profileServicesService: ProfileServicesService, private router: Router, private location: Location, private authServicesService: AuthServicesService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private previewService: PreviewService) { }

  ngOnInit(): void {
    this.SeesionIdDate = new Date(); // 2020-04-17T17:19:19.831Z
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd h:mm:ss', 'en');
    this.getIP();
    this.login = true;
  }

  getIP() {
    this.authServicesService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      this.getIpDetails(this.ipAddress);
    });
  }
  getIpDetails(ipAddress) {
    let key = "key=d25tuUTI2XMuXBik";
    let resp = this.authServicesService.getIpDetails(ipAddress, key);
    resp.subscribe(data => {
      if (data != null && data != "") {
        console.log(data, "ipdetails before");
        
        this.apDetails = JSON.parse(JSON.stringify(data));
        console.log(this.apDetails,"after parsing");
        
        sessionStorage.setItem('timezone', this.apDetails.timezone);
      }
    });
  }

  // form submit 
  saveUser(signinForm: NgForm) {
    // const user = this.authenticationService.userValue();

    console.log("*******before save user");
    
    let resp = this.authServicesService.serverLogin(this.signinInfo.email, this.signinInfo.password)
      .subscribe({
        next: () => {
          console.log("after getting token");
          
          this.authServicesService.Login(this.signinInfo.email, this.signinInfo.password)
            .subscribe(data => {
              console.log("inside login",data);
              if (data != null && data != undefined && data != "") {
                console.log("inside login 1",data);
                sessionStorage.setItem("email", data.emailAddress);
                sessionStorage.setItem("firstName", data.firstName);
                sessionStorage.setItem("lastName", data.lastName);
                sessionStorage.setItem("customerId", data.customerId);
                sessionStorage.setItem("customerSkey", data.customerSkey);
                // sessionStorage.setItem('tokenNo', data.tokenNo); 
                sessionStorage.setItem('countryCode', data.countryCode);
                // this.profileServicesService.setMessage("hi");
                this.DailySession();
                // console.log("inside login2",data);
              } else {
                this.login = false;
                // Toast.fire({
                //   icon: 'error',
                //   title: 'Login Failed'
                // })
              }
            });
        }
      });
    if(resp) {
      console.log(this.previewService.getloginFlag);
      this.login = this.previewService.getloginFlag;
    }
  }


  restmsg() {
    this.login = true;
  }

  DailySession() {
    this.dailySessionInfo.customerId = sessionStorage.getItem("customerId");
    this.dailySessionInfo.firstName = sessionStorage.getItem("firstName");
    this.dailySessionInfo.lastName = sessionStorage.getItem("lastName");
    this.dailySessionInfo.signIn = this.currentDate;
    this.dailySessionInfo.currentStatus = "Active";
    this.dailySessionInfo.comingFrom = "Samrt Digital";
    this.dailySessionInfo.sessionId = this.SeesionIdDate.getTime();
    this.dailySessionInfo.ipAddress = this.ipAddress;
    this.dailySessionInfo.lastModifiedOn = this.currentDate;
    this.dailySessionInfo.countryCode = sessionStorage.getItem("countryCode");
    // console.log("inside daily session");

    let resp = this.authServicesService.UpdateDailySession(this.dailySessionInfo);
    resp.subscribe(data => {
      console.log("inside daily session", data);

      if (data != null && data != "") {
        sessionStorage.setItem("dailySessionKey", data);
        this.router.navigate(['/dashboard']);
        // return resolveSanitizationFn;
        // console.log(this.router.navigate(['/dashboard']).);

        Toast.fire({
          icon: 'success',
          title: 'Welcome ' + sessionStorage.getItem("firstName")
        })
      }
    });
  }

  // user name Text box space remove function 
  onKeydown(event) {
    if (event.keyCode === 32) {
      return false;
    }
  }

  signIn() {
    if (sessionStorage.getItem("firstName") != null && sessionStorage.getItem("firstName") != ""
      && sessionStorage.getItem("firstName") != undefined && sessionStorage.getItem("lastName") != null
      && sessionStorage.getItem("lastName") != "" && sessionStorage.getItem("lastName") != undefined) {
      this.profileServicesService.setMessage("hi");
      this.router.navigate(['/dashboard']);
    }
    else {
      this.authServicesService.redirectToLogin();
      Toast.fire({
        icon: 'error',
        title: 'Session expired'
      })
    }
  }

  redirectToSignUp() {
    this.router.navigate(['/sign-up']);
  }

}
