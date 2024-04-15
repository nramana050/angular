import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { NgForm, FormGroup } from '@angular/forms';
import { ProfileServicesService } from 'src/app/profile-management/profile-services/profile-services.service';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import Swal from 'sweetalert2';
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userInfo: any = {
    processName: "",
    campaignName: ""

  };

  dashboarddata: any = {
    processName: "",
    processId: ""
  };

  // Select Process 
  selectedProcess = null;
  // Select Campaign 
  order: string = 'dashboadCampList.campaignId';
  reverse: boolean = true;
  selectedCampaign = null;
  allContactList: any = [];
  allcount: any;
  blackcount: any;
  opencount: any;
  clickCount: any;
  hardbounce: any;
  viewAllcontact: {};
  allContactData: any = [];
  processData: any = [];
  processId: any;
  dashboadCampList: any = [];
  dashboadCampData: any = [];
  campaignId: any;
  dashboardCountdata: any = {};
  ListData: any = [];
  viewReportbtn = false;
  historyFlg: any;



  constructor(private router: Router, private location: Location, private profileServicesService: ProfileServicesService, private orderPipe: OrderPipe, private previewService: PreviewService, private emailService: EmailManaementService) { }

  ngOnInit(): void {
    this.defalutvalue();
    // this.getProfileDetails();
    this.getAllList();

    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('foo')
    }
    this.getdashboardCount();
    this.getAllCampProcessList();
  }

  // get dashboard count
  getdashboardCount() {
    let resp = this.profileServicesService.getdashboardCount(sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != null && data != "") {
        this.allContactList = data;
        this.allcount = this.allContactList.allDashCount;
        this.clickCount = this.allContactList.clickCount;
        this.opencount = this.allContactList.openCount;
        this.blackcount = this.allContactList.blacklistedCount;
        this.hardbounce = this.allContactList.hardbouncecount;
      } else {
        this.allcount = 0;
        this.clickCount = 0;
        this.opencount = 0;
        this.blackcount = 0;
        this.hardbounce = 0;

      }

    })

  }

  defalutvalue() {
    this.dashboardCountdata.clickCount = 0;
    this.dashboardCountdata.blacklistedCount = 0;
    this.dashboardCountdata.hardbouncecount = 0;
    this.dashboardCountdata.complaintcount = 0;
    this.dashboardCountdata.openCount = 0;
    this.dashboardCountdata.mailsentCount = 0;
    this.dashboardCountdata.senderEmailAddress = "NA";
    this.dashboardCountdata.deliveredcont = 0;
    this.dashboardCountdata.unsubscribedcount = 0;
    this.dashboardCountdata.softBouncecount = 0;
    this.dashboardCountdata.hardBouncecount = 0;
    this.dashboardCountdata.Listname = "NA";
    this.dashboardCountdata.campaignStartDate = null;
    this.dashboardCountdata.campaignEndDate = null;
  }

  getProfileDetails() {
    if (sessionStorage.getItem("customerId") != null && sessionStorage.getItem("customerId") != undefined) {
      let resp = this.profileServicesService.getProfileDetails(sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        this.userInfo = data;
      })
    }
  }

  getAllCampProcessList() {
    let resp = this.emailService.getAllCampProcessList();
    resp.subscribe(data => {
      if (data != 0) {
        this.processData = data;
      }
    });
  }

  redirectToAllContacts(value) {
    if (value == "blackcount" && this.blackcount != 0) {
      sessionStorage.setItem('countClickId', value);
      sessionStorage.setItem('dashBoradCount', this.blackcount);
      this.router.navigate(['/countall-contacts']);
    } else if (value == "opencount" && this.opencount != 0) {
      sessionStorage.setItem('countClickId', value);
      sessionStorage.setItem('dashBoradCount', this.opencount);
      this.router.navigate(['/countall-contacts']);
    } else if (value == "clickCount" && this.clickCount != 0) {
      sessionStorage.setItem('countClickId', value);
      sessionStorage.setItem('dashBoradCount', this.clickCount);
      this.router.navigate(['/countall-contacts']);
    } else if (value == "hardbounce" && this.hardbounce != 0) {
      sessionStorage.setItem('countClickId', value);
      sessionStorage.setItem('dashBoradCount', this.hardbounce);
      this.router.navigate(['/countall-contacts']);

    } else if (value == "allcount" && this.allcount != 0) {
      sessionStorage.setItem('countClickId', value);
      sessionStorage.setItem('dashBoradCount', this.allcount);
      this.router.navigate(['/countall-contacts']);
    } else {
      Swal.fire("No contacts");
    }
  }

  // get camp name
  GetCampName() {
    this.viewReportbtn = false;
    this.dashboadCampData = [];
    this.defalutvalue();
    this.dashboadCampList = [];
    this.dashboarddata.campaignName = "undefined";
    this.processId = this.dashboarddata.processName;
    let resp = this.profileServicesService.getdashboardCampName(this.processId, sessionStorage.getItem("customerId"));
    resp.subscribe(data => {
      if (data != 0) {
        this.dashboadCampList = data;
      }
    });
  }

  // form submit  on campaign change
  setDataUser(dashboardFilter: NgForm) {
    this.viewReportbtn = false;
    this.dashboadCampData = [];
    this.defalutvalue();
    this.historyFlg = null; 
    this.campaignId = this.dashboarddata.campaignName
    for (let i in this.dashboadCampList) {
      if (this.dashboadCampList[i].historyFlg == "1" && this.dashboadCampList[i].campaignId == this.campaignId) {
        this.historyFlg = this.dashboadCampList[i].historyFlg;
      } 
    }
    if (this.historyFlg == "1") {
      let resp = this.profileServicesService.getdashboardCampHistoryData(this.campaignId, sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        if (data != 0) {
          this.viewReportbtn = true;
          this.dashboadCampData = data;
          for (let i in this.dashboadCampData) {

            if (this.dashboadCampData[i].campaignId == this.campaignId) {
              this.dashboardCountdata = {};
              this.dashboardCountdata.campaignId = this.dashboadCampData[i].campaignId;
              this.dashboardCountdata.campaignName = this.dashboadCampData[i].campaignName;
              this.dashboardCountdata.campaignStartDate = this.dashboadCampData[i].campaignStartDate;
              this.dashboardCountdata.campaignEndDate = this.dashboadCampData[i].campaignEndDate;
              this.dashboardCountdata.blacklistedCount = this.dashboadCampData[i].blacklistedCount;
              this.dashboardCountdata.complaintcount = this.dashboadCampData[i].complaintcount;
              this.dashboardCountdata.clickCount = this.dashboadCampData[i].clickCount;
              this.dashboardCountdata.openCount = this.dashboadCampData[i].openCount;
              this.dashboardCountdata.mailsentCount = this.dashboadCampData[i].mailsentCount;
              this.dashboardCountdata.senderEmailAddress = this.dashboadCampData[i].senderEmailAddress;
              this.dashboardCountdata.deliveredcont = this.dashboadCampData[i].deliveredcont;
              this.dashboardCountdata.unsubscribedcount = this.dashboadCampData[i].unsubscribedcount;
              this.dashboardCountdata.softBouncecount = this.dashboadCampData[i].softBouncecount;
              this.dashboardCountdata.hardBouncecount = this.dashboadCampData[i].hardBouncecount;
              this.dashboardCountdata.subject = this.dashboadCampData[i].subject;
              this.dashboardCountdata.campaignStatus = this.dashboadCampData[i].campaignStatus;
              this.dashboardCountdata.pushSec = this.dashboadCampData[i].pushSec;
              this.dashboardCountdata.listId = this.dashboadCampData[i].campaignListMap.listId;
              this.dashboardCountdata.historyFlg = this.historyFlg;
              let Listname = "";
              for (let j in this.dashboadCampData[i].campaignListMap) {
                for (let r in this.ListData) {
                  if (this.ListData[r].listId == this.dashboadCampData[i].campaignListMap[j].listId) {
                    Listname = Listname + "," + this.ListData[r].listName;
                  }
                }
              }
              var myListName = Listname;
              if (myListName.charAt(0) === ',') {
                myListName = myListName.slice(1);
                this.dashboardCountdata.Listname = myListName;
              }
            }
          }
        }
      });
    } else {
      let resp = this.profileServicesService.getdashboardCampData(this.campaignId, sessionStorage.getItem("customerId"));
      resp.subscribe(data => {
        if (data != 0) {
          this.viewReportbtn = true;
          this.dashboadCampData = data;
          for (let i in this.dashboadCampData) {

            if (this.dashboadCampData[i].campaignId == this.campaignId) {
              this.dashboardCountdata = {};
              this.dashboardCountdata.campaignId = this.dashboadCampData[i].campaignId;
              this.dashboardCountdata.campaignName = this.dashboadCampData[i].campaignName;
              this.dashboardCountdata.campaignStartDate = this.dashboadCampData[i].campaignStartDate;
              this.dashboardCountdata.campaignEndDate = this.dashboadCampData[i].campaignEndDate;
              this.dashboardCountdata.blacklistedCount = this.dashboadCampData[i].blacklistedCount;
              this.dashboardCountdata.complaintcount = this.dashboadCampData[i].complaintcount;
              this.dashboardCountdata.clickCount = this.dashboadCampData[i].clickCount;
              this.dashboardCountdata.openCount = this.dashboadCampData[i].openCount;
              this.dashboardCountdata.mailsentCount = this.dashboadCampData[i].mailsentCount;
              this.dashboardCountdata.senderEmailAddress = this.dashboadCampData[i].senderEmailAddress;
              this.dashboardCountdata.deliveredcont = this.dashboadCampData[i].deliveredcont;
              this.dashboardCountdata.unsubscribedcount = this.dashboadCampData[i].unsubscribedcount;
              this.dashboardCountdata.softBouncecount = this.dashboadCampData[i].softBouncecount;
              this.dashboardCountdata.hardBouncecount = this.dashboadCampData[i].hardBouncecount;
              this.dashboardCountdata.subject = this.dashboadCampData[i].subject;
              this.dashboardCountdata.campaignStatus = this.dashboadCampData[i].campaignStatus;
              this.dashboardCountdata.pushSec = this.dashboadCampData[i].pushSec;
              this.dashboardCountdata.listId = this.dashboadCampData[i].campaignListMap.listId;
              this.dashboardCountdata.historyFlg = this.historyFlg;
              let Listname = "";
              for (let j in this.dashboadCampData[i].campaignListMap) {
                for (let r in this.ListData) {
                  if (this.ListData[r].listId == this.dashboadCampData[i].campaignListMap[j].listId) {
                    Listname = Listname + "," + this.ListData[r].listName;
                  }
                }
              }
              var myListName = Listname;
              if (myListName.charAt(0) === ',') {
                myListName = myListName.slice(1);
                this.dashboardCountdata.Listname = myListName;
              }
            }
          }
        }
      });
    }


  }

  getAllList() {
    let resp = this.emailService.getAllList();
    resp.subscribe(data => {
      if (data != null && data != '') {
        this.ListData = data;

      }
    });
  }

  //Vew Campaign
  redirectToViewCampaign() {
    if (this.dashboardCountdata.campaignId != null && this.dashboardCountdata.campaignId != undefined && this.dashboardCountdata.campaignId != "" && this.dashboardCountdata.mailsentCount != 0) {
      sessionStorage.setItem("campaignId", this.dashboardCountdata.campaignId);
      sessionStorage.setItem("commingFrom", "Dashboard");
      this.previewService.ViewCampaignList = this.dashboardCountdata;
      this.previewService.historyFlg = this.dashboardCountdata.historyFlg;
      this.previewService.count = 50;
      this.router.navigate(['/view-campaign']);
    } else {
      Swal.fire("No contacts")
    }
  }

}
