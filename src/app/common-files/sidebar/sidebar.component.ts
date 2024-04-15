import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, formatDate } from "@angular/common";
import { AuthServicesService } from 'src/app/auth/auth-services/auth-services.service';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { AccountServicesService } from 'src/app/account-management/account-services/account-services.service';
declare var $;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  firstName: any;
  DaliyData: any = [];
  lastName: any;
  login = false;
  navbarOpen = false;
  active;
  role: any;
  createCampaign = false;
  customerId: any;
  dailySessionKey: any;
  currentDate: any;
  signinDate: any;
  imageUpload: any;
  ImageSource: any;
  customerSkey: any;
  subscription: Subscription;
  disableFlag: Subscription;

  dailySessionInfo = {
    customerId: "",
    firstName: "",
    dailySessionKey: "",
    lastName: "",
    comingFrom: ""
  }


  constructor(private router: Router, private location: Location, private previewService: PreviewService, private authServicesService: AuthServicesService, private profileServicesService: ProfileServicesService, private sanitizer: DomSanitizer, private accountServicesService: AccountServicesService) {
    this.customerId = sessionStorage.getItem("customerId");
    this.subscription = this.profileServicesService.getMessage().subscribe(message => {
      // console.log(message);

      this.getProfileImage(sessionStorage.getItem("customerSkey"));
      this.getProfileDetails();
    });

    this.disableFlag = this.profileServicesService.getdisable().subscribe(message => {
      // console.log(message);
      this.disableSidebar();
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === "/login" || event.url === "/forgot-password" || event.url.includes("/unsubscribe") || event.url.includes("/reset-password") || event.url === "/" || event.url.includes("/sign-up") || event.url.includes("/static")) {
          this.login = false;
        } else {
          this.login = true;

          let currentUrl = window.location.href;
          let tmpVar = currentUrl.includes('/dashboard');
          if (currentUrl.includes('/dashboard')) {
            window.onpopstate = function (event) {
              history.go(1);
            }
          }
        }
      }
    });

  }

  ngOnInit(): void {

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     if (event.url != "/login" && event.url != "/forgot-password" && !event.url.includes("/unsubscribe") && !event.url.includes("/reset-password") && event.url != "/" && !event.url.includes("/sign-up")) {

    //       if (sessionStorage.getItem("customerId") === null || sessionStorage.getItem("customerId") === undefined || sessionStorage.getItem("customerId") === 'null' || sessionStorage.getItem("customerId") === ""
    //         || sessionStorage.getItem("tokenNo") === null || sessionStorage.getItem("tokenNo") === undefined || sessionStorage.getItem("tokenNo") === 'null' || sessionStorage.getItem("tokenNo") === "") {
    //         this.authServicesService.redirectToLogin();
    //       }
    //     }
    //   }
    // });

    this.firstName = sessionStorage.getItem("firstName");
    this.lastName = sessionStorage.getItem("lastName");
    this.customerId = sessionStorage.getItem("customerId");
    this.customerSkey = sessionStorage.getItem("customerSkey");
    this.dailySessionKey = sessionStorage.getItem("dailySessionKey");
    this.currentDate = formatDate(new Date(), 'yyyy-MM-dd h:mm:ss', 'en');
    if (this.customerSkey != null && this.customerSkey != undefined && this.customerSkey != "") {
      this.getProfileImage(this.customerSkey);
    }
    this.getProfileDetails();
    this.disableSidebar();
  }

  getProfileImage(customerSkey) {
    var reader = new FileReader();
    let resp = this.profileServicesService.getProfileImage(customerSkey);
    resp
      .subscribe((baseImage: any) => {

        if (baseImage != null && baseImage.profileImage != null && baseImage.profileImage != "") {
          let objectURL = 'data:profileImage/jpeg;base64,' + baseImage.profileImage;
          this.ImageSource = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        } else {
          this.ImageSource = "assets/images/avtar.png";
        }
      });
  }

  getProfileDetails() {
    if (sessionStorage.getItem("customerId") != null && sessionStorage.getItem("customerId") != undefined) {
      let resp = this.profileServicesService.getProfileDetails(sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.dailySessionInfo = data;
        this.getDailySeeion();
      })
    }
  }


  getDailySeeion() {
    let resp = this.authServicesService.getDailySession(sessionStorage.getItem("dailySessionKey"));
    resp.subscribe(data => {
      this.DaliyData = data;
    });

  }
  redirectToProfileEdit() {
    this.router.navigate(['/profile-edit']);
  }

  redirectToLogin() {
    this.UpdateDailySession();
    // sessionStorage.setItem("email", null);
    // sessionStorage.setItem("firstName", null);
    // sessionStorage.setItem("lastName", null);
    // sessionStorage.setItem("customerId", null);
    // sessionStorage.setItem("dailySessionKey", null);
    // sessionStorage.setItem("campaignId", null);
    // sessionStorage.setItem("commingFrom", null);
    // sessionStorage.setItem("countClickId", null);
    // sessionStorage.setItem("tokenNo", null);
    // sessionStorage.setItem("data", null);
    // sessionStorage.setItem("access_token", null);
    // sessionStorage.setItem("auth", null);
    this.authServicesService.userStoreValue = undefined;
    sessionStorage.clear();
    this.authServicesService.redirectToLogin();
  }



  UpdateDailySession() {
    // calculate hrs
    this.signinDate = this.DaliyData.signIn;
    let endDate: any = new Date(this.signinDate);
    let purchaseDate: any = new Date(this.currentDate);

    let diffMs = (purchaseDate - endDate); // milliseconds 
    let totalSeconds = diffMs / 1000;
    let totalMinutes = totalSeconds / 60;
    let totalHours = totalMinutes / 60;
    let seconds = Math.floor(totalSeconds) % 60;
    let minutes = Math.floor(totalMinutes) % 60;
    let hours = Math.floor(totalHours) % 60;
    this.DaliyData.loginHrs = "0" + hours + ":" + "0" + minutes + ":" + seconds;
    this.DaliyData.signOut = this.currentDate;
    this.DaliyData.currentStatus = "InActive"
    this.DaliyData.lastModifiedOn = this.currentDate;
    let resp = this.authServicesService.UpdateDailySession(this.DaliyData);
    resp.subscribe(data => {

    });
  }
  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  redirectToCampaignMngmnt() {
    this.router.navigate(['/campaign-management']);
  }

  redirectToCreateCampaign() {
    this.router.navigate(['/dashboard']);
  }

  redirectToProcessManagement() {
    this.previewService.campaignRouting = "";
    this.previewService.commingFrom = "";
    this.previewService.selectedCampaignIdListRouting = null;
    this.previewService.selectedroutingList = null;
    this.router.navigate(['/process-management']);
  }
  redirectTocontactUs() {
    this.router.navigate(['/contact-us']);
  }

  redirectToCreateList() {
    this.previewService.campaignRouting = "";
    this.previewService.commingFrom = "";
    this.previewService.selectedCampaignIdListRouting = null;
    this.previewService.selectedroutingList = null;
    this.router.navigate(['/create-list']);
  }

  redirectToaddContact() {
    this.router.navigate(['/add-contact']);
  }

  redirectToNotification() {
    this.router.navigate(['/notification']);
  }

  redirectToDomain() {
    this.router.navigate(['/domain-blocker']);
  }

  redirectToaddSender() {
    this.previewService.campaignRouting = "";
    this.previewService.commingFrom = "";
    this.previewService.selectedCampaignIdListRouting = null;
    this.previewService.selectedroutingList = null;
    this.router.navigate(['/add-sender']);
  }
  redirectToTemplate() {
    this.previewService.campaignRouting = "";
    this.previewService.commingFrom = "";
    this.previewService.selectedCampaignIdListRouting = null;
    this.previewService.selectedroutingList = null;
    this.router.navigate(['/template']);
  }

  // Menu hover click
  activeClk(input) {
    $("#" + input).addClass('active').parent().find('li').removeClass('active');
    $("#" + input).addClass('active').siblings('li').parent('li').find('li').removeClass('active');

    this.active = input;
  }

  activeClk2(input) {
    $("#" + input).addClass('active').parent().find('li').removeClass('active');
    $("#" + input).addClass('active').siblings('li').parent('li').find('li').removeClass('active');

    this.active = input;
  }

  // SIDEBAR TOGGLE 
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  redirectToChangePassword() {
    this.router.navigate(['/change-password']);
  }

  redirectToSignIn() {
    this.authServicesService.redirectToLogin();
  }


  // EDIT/UPDATE BUTTON TOGGLE 
  isShowDiv = false;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }

  redirectTopaymentHistory() {
    this.router.navigate(['/payment-history']);
  }

  redirectToOverview() {
    this.router.navigate(['/overview']);
  }

  redirectToActivity() {
    this.router.navigate(['/activity']);
  }

  disableSidebar() {
    if (!this.authServicesService.userValue()) {

      let resp = this.profileServicesService.getCurrentSubscriptionDetails(sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        if (data != null) {
          if (data.pauseSubscription == "Y") {
            // this.router.navigate(['/profile-edit']);
            var items = document.querySelectorAll<HTMLElement>('#process, #contactManagement, #dashboard, #campaign, #template');
            for (var i = 0; i < items.length; i++) {
              items[i].style.pointerEvents = "none";
            }
            document.body.style.overflowY = "auto";
          }
          else if (data.pauseSubscription != "Y") {
            var items = document.querySelectorAll<HTMLElement>('#process, #contactManagement, #dashboard, #campaign, #template');
            for (var i = 0; i < items.length; i++) {
              items[i].style.pointerEvents = "auto";
            }
            document.body.style.overflowY = "auto";
          }
        }
      });
    }
  }


}
