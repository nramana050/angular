import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Location, DatePipe } from "@angular/common";
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import Swal from 'sweetalert2';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { OrderPipe } from 'ngx-order-pipe';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as moment from 'moment';

declare var $: any;

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
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateCampaignComponent implements OnInit {
  @ViewChild('closenewListModal') closenewListModal: ElementRef;

  pausereadonly = false;
  zone = true;
  // Checkbox 
  routePage = "";
  order: string = 'ListData.listId';
  reverse: boolean = true;
  btnName: string = "Save";
  pageName: String = "Create"
  userGroup: any;
  scheduleLater: string = '';
  selectlistNam: any;
  listTemp: any;
  weekendList: any = [];
  listrouting: any;
  campNameflg = false;
  editMode = false;
  oneCLick = false;
  reputationDetails: any = [];
  disablePause = false;

  userInfo: any = {
    campaign: "",
    fromName: "",
    selectlistName: "",
    templateName: "",
    typeOfTemplate: "",
    campaigndesc: "",
    processdesc: "",
    channel: "",
    channelName: "",
    processName: "",
    sheduleDate: "",
    sheduleDateTime: "",
    shchedule: "",
    unsubscribe: "",
    softBounce: "",
    duplicate: "",
    campaignSkey: "",
    customerId: "",
    campaignId: "",
    createdOn: "",
    status: "",
    pushSec: "30",
    spuseflg: "",
    campaignPauseTime: "",
    timeZone: "",
    campaignResumeTime: "",
    skipWeekend: "",
    weekends: "",
    custCampaignId: "",
    timeZoneSelection: "",
    Monday: "",
    Tuesday: "",
    Wednesday: "",
    Thursday: "",
    Friday: "",
    Saturday: "",
    Sunday: ""
  };
  timeZoneTemp: any = {};
  lastSelection = null;
  timeZoneSelection = [];
  searchList: any;
  roleFlg = 0;
  includeflg = '0';
  routingFlg = false;
  processData: any = [];
  ChanelData: any;
  senderData: any = [];
  tempList = [];
  ListName: any = [];
  ListNameRouting: any = [];
  ShowHideInculdeList: any = [];
  showHidedata: any = {};
  mapdata: any;
  search;
  btn = "More"
  openModal = false;

  ListData = [];
  templateData: any;
  customerId: any;
  campaignData: any;
  routingCampData: any;
  public objects;
  changeFlg = false;
  timeZoneList: any;
  submitFlg = false;
  dobflag = 0;
  weekendFlag = false;


  hideFlag: boolean = true;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  dropdownSettingsZone: IDropdownSettings;
  constructor(private router: Router, private location: Location, private orderPipe: OrderPipe, private emailService: EmailManaementService, private previewService: PreviewService, public datepipe: DatePipe) {

    this.customerId = sessionStorage.getItem("customerId");
    this.getAllCampProcessList();
    this.getAllSenderList();
    this.getAllTemplateList();
    this.getAllChannelList();
    this.userInfo.channelName = 1;
    this.userInfo.shchedule = "scheduleNow";
    this.userInfo.spuseflg = "false";
    if (sessionStorage.getItem("timezone") != null && sessionStorage.getItem("timezone") != undefined && sessionStorage.getItem("timezone") != "") {
      this.userInfo.timeZone = sessionStorage.getItem("timezone");
    }
  }
  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'listId',
      textField: 'listName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.dropdownSettingsZone = {
      singleSelection: true,
      idField: 'zoneName',
      textField: 'zoneDetails',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    // this.dropdownList = [
    //     { listId: 1, listName: 'Mumbai' },
    //     { listId: 2, listName: 'Bangaluru' },
    //     { listId: 3, listName: 'Pune' },
    //     { listId: 4, listName: 'Navsari' },
    //     { listId: 5, listName: 'New Delhi' }
    //   ];


    $(document).ready(function () {
      $("#dropdown-btn").click(function () {
        $("#dropdown").toggle();
      });
      $(document).on("click", function (event) {
        var trigger = $("#dropdown-btn")[0];
        var dropdown = $("#dropdown");
        if (dropdown !== event.target && !dropdown.has(event.target).length && trigger !== event.target) {
          $("#dropdown").hide();
        }
      });
    });

    $(document).ready(function () {
      $("#show").click(function () {
        $("#tr").toggle(800);
      });
    });
    $("#tr").hide()

    this.timeZone();
  }


  onItemSelect(item: any) {
    for (let r in this.ListData) {
      if (this.ListData[r].listId == item.listId)
        if (this.ListData[r].uploadStatus != null && this.ListData[r].uploadStatus != "" && this.ListData[r].uploadStatus == "Uploading") {
          Swal.fire("List uploading in progress")
        }
    }
  }

  onSelectAll(items: any) {
    let uploadflg = 0;
    for (let r in this.ListData) {
      for (let i in items) {
        if (this.ListData[r].listId == items[i].listId)
          if (this.ListData[r].uploadStatus != null && this.ListData[r].uploadStatus != "" && this.ListData[r].uploadStatus == "Uploading") {
            uploadflg = 1;
          }
      }
    }
    if (uploadflg == 1) {
      Swal.fire("List uploading in progress")
    }
  }

  //
  setRoutingRecords() {
    // camp name
    this.userInfo.campaign = this.routingCampData.campaign;

    this.userInfo.Monday = false
    this.userInfo.Tuesday = false
    this.userInfo.Wednesday = false
    this.userInfo.Thursday = false
    this.userInfo.Friday = false
    this.userInfo.Saturday = false
    this.userInfo.Sunday = false;

    var res = this.routingCampData.Weekdays.split(",");
    let checkFLg = 0;
    for (let i in res) {
      if (res[i] === "Monday") {
        this.userInfo.Monday = true
        checkFLg = 1;
      } else if (res[i] === "Tuesday") {
        this.userInfo.Tuesday = true
        checkFLg = 1;
      } else if (res[i] === "Wednesday") {
        this.userInfo.Wednesday = true
        checkFLg = 1;
      } else if (res[i] === "Thursday") {
        this.userInfo.Thursday = true
        checkFLg = 1;
      } else if (res[i] === "Friday") {
        this.userInfo.Friday = true
        checkFLg = 1;
      } else if (res[i] === "Saturday") {
        this.userInfo.Saturday = true
        checkFLg = 1;
      } else if (res[i] === "Sunday") {
        this.userInfo.Sunday = true
        checkFLg = 1;
      }
      if (checkFLg == 1) {
        $("#weekend").prop("checked", true);
      }
    }


    // process Id
    if (this.routingCampData.processName != null) {
      this.userInfo.processName = this.routingCampData.processName;
    } else {
      this.userInfo.processName = '';
    }
    //processdesc
    if (this.routingCampData.processdesc != null) {
      this.userInfo.processdesc = this.routingCampData.processdesc;
    } else {
      this.userInfo.processdesc = '';
    }
    //sender
    if (this.routingCampData.fromName != null) {
      this.userInfo.fromName = this.routingCampData.fromName;
      this.ChkSenderVerified(this.routingCampData.fromName);
    } else {
      this.userInfo.fromName = '';
    }
    // unsubscibe
    if (this.routingCampData.unsubscribe == true) {
      this.userInfo.unsubscribe = this.routingCampData.unsubscribe;
    } else {
      this.userInfo.unsubscribe = ""
    }
    // duplicate
    if (this.routingCampData.duplicate == true) {
      this.userInfo.duplicate = this.routingCampData.duplicate;
    } else {
      this.userInfo.duplicate = ""
    }

    // skipWeekend
    if (this.routingCampData.skipWeekend == true) {
      this.userInfo.skipWeekend = this.routingCampData.skipWeekend;
    } else {
      this.userInfo.skipWeekend = ""
    }




    // soft bounce
    if (this.routingCampData.softBounce == true) {
      this.userInfo.softBounce = this.routingCampData.softBounce;
    } else {
      this.userInfo.softBounce = ""
    }

    //template
    if (this.routingCampData.templateName != null) {
      this.userInfo.templateName = this.routingCampData.templateName;
    } else {
      this.userInfo.templateName = ""
    }

    // subject
    if (this.routingCampData.subject != null) {
      this.userInfo.subject = this.routingCampData.subject;
    } else {
      this.userInfo.subject = ""
    }

    // campaigndesc
    if (this.routingCampData.campaigndesc != null) {
      this.userInfo.campaigndesc = this.routingCampData.campaigndesc;
    } else {
      this.userInfo.campaigndesc = ""
    }

    // communication channelName

    if (this.routingCampData.channelName != null) {
      this.userInfo.channelName = this.routingCampData.channelName;
    } else {
      this.userInfo.channelName = ""
    }

    //  shchedule

    if (this.routingCampData.shchedule != null) {
      this.userInfo.shchedule = this.routingCampData.shchedule;
    } else {
      this.userInfo.shchedule = ""
    }

    //sheduleDate

    if (this.routingCampData.sheduleDate != null) {
      this.userInfo.sheduleDate = this.routingCampData.sheduleDate;
      this.userInfo.sheduleDateTime = this.routingCampData.sheduleDateTime;
    } else {
      this.userInfo.sheduleDate = "";
      this.userInfo.sheduleDateTime = "";
    }

    //spuseflg
    if (this.routingCampData.spuseflg == 'true') {
      this.userInfo.spuseflg = this.routingCampData.spuseflg;
    } else {
      this.userInfo.spuseflg = 'false';
    }

    //campaignPauseTime
    if (this.routingCampData.campaignPauseTime != null) {
      this.userInfo.campaignPauseTime = this.routingCampData.campaignPauseTime;
    } else {
      this.userInfo.campaignPauseTime = "";
    }
    this.userInfo.custCampaignId = this.routingCampData.custCampaignId;
    //campaignResumeTime
    if (this.routingCampData.campaignResumeTime != null) {
      this.userInfo.campaignResumeTime = this.routingCampData.campaignResumeTime;
    } else {
      this.userInfo.campaignResumeTime = "";
    }

    //timeZone
    if (this.routingCampData.timeZone != null) {
      // this.userInfo.timeZone = this.routingCampData.timeZone;
      this.timeZoneSelection = this.routingCampData.timeZoneSelection;
      // console.log("****390");

    } else {
      this.userInfo.timeZone = "";
      // this.timeZoneSelection=[];
      // console.log("*else***390");
    }

    //pushSec
    if (this.routingCampData.pushSec != null) {
      this.userInfo.pushSec = this.routingCampData.pushSec;
    } else {
      this.userInfo.pushSec = "";
    }
  }

  //new changes
  routingListData() {
    this.ListNameRouting = [];
    for (let r in this.ListData) {
      if ($("#checkBox_" + r).is(":checked")) {
        if ($('#checkBox_' + r).val() == this.ListData[r].listId) {
          this.listrouting = {};
          this.listrouting.listId = $('#checkBox_' + r).val();
          this.ListNameRouting.push(this.listrouting);
          if (this.ListData[r].uploadStatus != null && this.ListData[r].uploadStatus != "" && this.ListData[r].uploadStatus == "Uploading") {
            Swal.fire("List uploading in progress")
          }
        }

      }
    }
  }

  // tome not Same
  timeNotSame(event, commingfrom) {
    var pauset = this.userInfo.campaignPauseTime.split(":");
    var resumet = this.userInfo.campaignResumeTime.split(":");

    if (pauset[0] == resumet[0]) {
      if (commingfrom == "resume") {
        this.userInfo.campaignResumeTime = "";
      } else {
        this.userInfo.campaignPauseTime = "";
      }
      Swal.fire("You cannot set same hour in resume time as entered in pause time.")
    }
  }


  //
  setEditRecords() {
    if (sessionStorage.getItem("Clone") != "Clone") {
      this.userInfo.campaign = this.campaignData.campaign.campaignName;
      this.userInfo.custCampaignId = this.campaignData.campaign.custCampaignId;
    } else {
      this.userInfo.campaign = this.campaignData.campaign.campaignName + "_" + "Copy1";
    }
    if (this.campaignData.campaign.processId != null) {
      this.userInfo.processName = this.campaignData.campaign.processId;
    } else {
      this.userInfo.processName = '';
    }

    if (this.campaignData.campaign.weekends != null && this.campaignData.campaign.weekends != "") {
      this.userInfo.weekends = this.campaignData.campaign.weekends;
      var res = this.userInfo.weekends.split(",");
      for (let i in res) {
        if (res[i] === "Monday") {
          this.userInfo.Monday = true
        } else if (res[i] === "Tuesday") {
          this.userInfo.Tuesday = true
        } else if (res[i] === "Wednesday") {
          this.userInfo.Wednesday = true
        } else if (res[i] === "Thursday") {
          this.userInfo.Thursday = true
        } else if (res[i] === "Friday") {
          this.userInfo.Friday = true
        } else if (res[i] === "Saturday") {
          this.userInfo.Saturday = true
        } else if (res[i] === "Sunday") {
          this.userInfo.Sunday = true
        }
        $("#weekend").prop("checked", true);
      }
    } else {
      this.userInfo.weekends = "";
    }

    for (let i in this.processData) {

      if (this.processData[i].processId == this.campaignData.campaign.processId) {
        this.userInfo.processdesc = this.processData[i].processDescription;
      }

    }


    if (this.campaignData.campaign.senderId != null) {
      this.userInfo.fromName = this.campaignData.campaign.senderId;
      this.ChkSenderVerified(this.userInfo.fromName);
    } else {
      this.userInfo.fromName = '';
    }
    if (this.campaignData.campaign.softBounce == "1") {
      this.userInfo.softBounce = true;
    } else {
      this.userInfo.softBounce = false;
    }

    if (this.campaignData.campaign.unsubscribe == "1") {

      this.userInfo.unsubscribe = true;
    } else {
      this.userInfo.unsubscribe = false;
    }

    if (this.campaignData.campaign.duplicate == "1") {

      this.userInfo.duplicate = true;
    } else {
      this.userInfo.duplicate = false;
    }


    if (this.campaignData.campaign.skipWeekend == "Y") {
      this.userInfo.skipWeekend = true;
    } else {
      this.userInfo.skipWeekend = false;
    }



    if (this.campaignData.campaign.emailTemplateSkey != null) {
      this.userInfo.templateName = this.campaignData.campaign.emailTemplateSkey;
    } else {
      this.userInfo.templateName = '';
    }
    this.userInfo.campaigndesc = this.campaignData.campaign.campaignDescription;
    this.userInfo.subject = this.campaignData.campaign.subject;
    this.userInfo.pushSec = this.campaignData.campaign.pushSec;
    if (this.campaignData.campaign.channelSkey != null) {
      this.userInfo.channelName = this.campaignData.campaign.channelSkey;
    } else {
      this.userInfo.channelName = '';
    }

    this.userInfo.shchedule = this.campaignData.campaign.scheduleCampaign;
    this.userInfo.campaignSkey = this.campaignData.campaign.campaignSkey;
    this.userInfo.customerId = this.campaignData.campaign.customerId;
    this.userInfo.campaignId = this.campaignData.campaign.campaignId;
    this.userInfo.createdOn = this.campaignData.campaign.createdOn;
    this.userInfo.status = this.campaignData.campaign.status;
    this.userInfo.custCampaignId = this.campaignData.campaign.custCampaignId;

    if (this.campaignData.campaign.campaignPauseTime != null && this.campaignData.campaign.campaignPauseTime != undefined && this.campaignData.campaign.campaignPauseTime != "") {
      this.userInfo.spuseflg = 'true';
      this.userInfo.campaignPauseTime = this.campaignData.campaign.campaignPauseTime;
      this.userInfo.campaignResumeTime = this.campaignData.campaign.campaignResumeTime;
    }
    this.timeZoneSelection = [];
    if (this.campaignData.campaign.timeZone != null && this.campaignData.campaign.timeZone != "") {
      this.timeZoneTemp = {};
      for (let n in this.timeZoneList) {
        if (this.timeZoneList[n].zoneName == this.campaignData.campaign.timeZone) {
          this.timeZoneTemp.zoneDetails = this.timeZoneList[n].zoneDetails;
        }
      }
      this.timeZoneTemp.zoneName = this.campaignData.campaign.timeZone;
      this.timeZoneSelection.push(this.timeZoneTemp);
    }

    let temp = this.datepipe.transform(this.campaignData.campaign.campaignStartDate, "yyyy-MM-dd'T'HH:mm:ss");
    this.userInfo.sheduleDate = this.datepipe.transform(temp, "yyyy-MM-dd");
    this.userInfo.sheduleDateTime = this.datepipe.transform(temp, "HH:mm");

    this.tempList = [];
    for (let i in this.campaignData.campaignListMap) {
      this.showHidedata = {};
      this.showHidedata.listId = this.campaignData.campaignListMap[i].listId;
      this.showHidedata.customerId = this.customerId;
      this.ShowHideInculdeList.push(JSON.parse(JSON.stringify(this.showHidedata)))

      for (let r in this.ListData) {
        if (this.ListData[r].listId == this.campaignData.campaignListMap[i].listId) {
          this.tempList.push(this.ListData[r]);
        }
      }
    }
    this.selectedItems = this.tempList;
    let resp = this.emailService.HideShowInclude(this.ShowHideInculdeList);
    resp.subscribe(data => {
      if (data == 0 || data == '0') {
        this.includeflg = '0';
      } else {
        this.includeflg = '1';
      }
    });

    this.getListonEdit();
  }

  getListonEdit() {
    this.tempList = [];
    if (this.editMode == true && this.oneCLick == false && this.routingFlg == false) {
      this.oneCLick = true;
      for (let i in this.campaignData.campaignListMap) {
        for (let r in this.ListData) {
          if ($('#checkBox_' + r).val() == this.campaignData.campaignListMap[i].listId) {
            $("#checkBox_" + r).prop("checked", true);
          }
        }
      }
    }

    if (this.routingFlg == true && this.oneCLick == false) {
      this.oneCLick = true;
      for (let i in this.ListNameRouting) {
        for (let r in this.ListData) {
          if ($('#checkBox_' + r).val() == this.ListNameRouting[i].listId) {
            $("#checkBox_" + r).prop("checked", true);
          }
        }
      }
    }
    return true;
  }

  checkChangeFlg() {
    if (this.pausereadonly == false) {
      this.changeFlg = true;
    }
    // console.log("***change");

  }

  getWeekendsList() {
    // week days
    var Weekdays = "";
    if (this.userInfo.Monday == true) {
      Weekdays = "Monday";
    } if (this.userInfo.Tuesday == true) {
      Weekdays = Weekdays + "," + "Tuesday";
    } if (this.userInfo.Wednesday == true) {
      Weekdays = Weekdays + "," + "Wednesday";
    }

    if (this.userInfo.Thursday == true) {
      Weekdays = Weekdays + "," + "Thursday";
    }

    if (this.userInfo.Friday == true) {
      Weekdays = Weekdays + "," + "Friday";
    }

    if (this.userInfo.Saturday == true) {
      Weekdays = Weekdays + "," + "Saturday";
    }

    if (this.userInfo.Sunday == true) {
      Weekdays = Weekdays + "," + "Sunday";
    }
    this.userInfo.Weekdays = Weekdays;
  }


  redirectToCreateProcess() {
    this.getWeekendsList();
    this.previewService.campaignRouting = "campDashboard";
    this.userInfo.selectedItems = this.selectedItems;
    this.userInfo.timeZoneSelection = this.timeZoneSelection;
    this.previewService.selectedCampaignIdListRouting = this.userInfo;
    this.previewService.selectedroutingList = this.ListNameRouting;
    this.router.navigate(['/create-process']);
  }

  redirectToAddSender() {
    this.getWeekendsList();
    this.previewService.campaignRouting = "campDashboard";
    this.userInfo.selectedItems = this.selectedItems;
    this.userInfo.timeZoneSelection = this.timeZoneSelection;
    this.previewService.selectedCampaignIdListRouting = this.userInfo;
    this.previewService.selectedroutingList = this.ListNameRouting;
    this.router.navigate(['/add-sender']);
  }

  redirectToCreateTemplate() {
    this.getWeekendsList();
    this.previewService.campaignRouting = "campDashboard";
    this.userInfo.selectedItems = this.selectedItems;
    this.userInfo.timeZoneSelection = this.timeZoneSelection;
    this.previewService.selectedCampaignIdListRouting = this.userInfo;
    this.previewService.selectedroutingList = this.ListNameRouting;
    this.router.navigate(['/create-template']);
  }

  redirectToCreateList() {
    this.getWeekendsList();
    this.previewService.campaignRouting = "campDashboard";
    this.userInfo.selectedItems = this.selectedItems;
    this.userInfo.timeZoneSelection = this.timeZoneSelection;
    this.previewService.selectedCampaignIdListRouting = this.userInfo;
    this.previewService.selectedroutingList = this.ListNameRouting;
    this.router.navigate(['/create-list']);
  }

  redirectToConfiguration() {
    this.router.navigate(['/configuration']);
  }

  // api integration


  getUniqueCampName(campName) {
    let resp = this.emailService.getUniqueCampName(campName);
    resp.subscribe(data => {
      if (data != null && data != '') {
        this.userInfo.campaign = "";
        Swal.fire("Campaign name already available");

      }
    });
  }
  getAllCampProcessList() {
    let resp = this.emailService.getAllCampProcessList();
    resp.subscribe(data => {
      if (data != 0) {
        this.processData = data;
      }
    });
  }

  getAllSenderList() {
    let resp = this.emailService.getAllSenderList();
    resp.subscribe(data => {
      if (data != 0) {
        this.senderData = data;
      }
    });
  }

  getAllList() {
    this.ListData = [];
    this.tempList = [];
    let resp = this.emailService.getAllList();
    resp.subscribe(data => {
      if (data != 0 && data != null && data != "" && data != undefined) {
        for (let i in data) {
          if (data[i].contactCount != null && data[i].contactCount != "" &&
            Number(data[i].contactCount) >= 1) {
            this.tempList.push(data[i]);
          }
        }
        this.ListData = this.tempList;

        if (this.previewService.selecteCampaignIdList != null && this.previewService.selecteCampaignIdList != undefined && this.previewService.selecteCampaignIdList != "") {
          this.campaignData = this.previewService.selecteCampaignIdList;
          this.pausereadonly = false;

          if (this.campaignData.campaign.campaignStatus == "Pause") {
            this.pausereadonly = true;
          }
          if (sessionStorage.getItem("Clone") != "Clone") {

            this.setEditRecords();
            this.campNameflg = true;
            this.editMode = true;
            this.btnName = "Update";
            this.pageName = "Edit"
          } else {
            this.pausereadonly = false;
            this.setEditRecords();
            this.campNameflg = false;
            this.editMode = true;
            this.btnName = "Save";
            this.pageName = "Create"
          }
        } else {
          this.campNameflg = false;
        }



        if (this.previewService.selectedCampaignIdListRouting != null && this.previewService.selectedCampaignIdListRouting != undefined && this.previewService.selectedCampaignIdListRouting != "") {
          this.routingFlg = true;
          this.routingCampData = this.previewService.selectedCampaignIdListRouting;
          if (this.routingCampData.campaign != null && this.routingCampData.campaign != undefined && this.routingCampData.campaign != "") {
            this.changeFlg = true;
          }
          this.selectedItems = this.routingCampData.selectedItems;
          this.setRoutingRecords();
        }

        if (this.previewService.selectedroutingList != null && this.previewService.selectedroutingList != undefined && this.previewService.selectedroutingList != "") {
          this.ListNameRouting = this.previewService.selectedroutingList;
          this.routingFlg = true;
          if (this.routingCampData.campaign != null && this.routingCampData.campaign != undefined && this.routingCampData.campaign != "") {
            this.changeFlg = true;
          }
          this.getListonEdit();
        }
      }
    });
  }

  getAllTemplateList() {
    let resp = this.emailService.getAllTemplateList();
    resp.subscribe(data => {
      if (data != 0) {
        this.templateData = data;
      }
    });
  }

  getAllChannelList() {
    let resp = this.emailService.getAllChannelList();
    resp.subscribe(data => {
      if (data != 0) {
        this.ChanelData = data;
      }
    });
  }

  // chk sender verified
  ChkSenderVerified(fromName) {
    let tempFlg = 0;
    if (fromName !== this.lastSelection) {
      if (fromName != "" && this.lastSelection != null) {
        tempFlg = 0;
      } else {
        tempFlg = 1;
        //reset flag
      }
      // this.userInfo.spuseflg = "false";
      this.disablePause = false;
      this.lastSelection = fromName;
    } else {
      tempFlg = 1;
      // this.userInfo.spuseflg = "false";
      this.disablePause = false;
      //reset flag
    }
    for (let r in this.senderData) {
      if (this.senderData[r].senderId == fromName) {
        if (this.senderData[r].verificationStatus == 'pending' || this.senderData[r].verificationStatus == 'Pending') {
          this.userInfo.fromName = "";
          Swal.fire("Please verify sender!");
        }
        else if (this.senderData[r].newDomain === 'Y' && this.senderData[r].day != null && this.senderData[r].day != '') {
          this.reputationDetails.newDomain = this.senderData[r].newDomain;
          this.reputationDetails.day = this.senderData[r].day;
          this.reputationDetails.emailAddress = this.senderData[r].emailAddress;
          let resp = this.emailService.getEmailCount(this.senderData[r].day);
          resp.subscribe(data => {
            if (data != null) {
              //disable flag && set  default value in pause n resume && yes 
              this.reputationDetails.numberOfEmail = data.numberOfEmail;
              if (tempFlg == 0) {
                // document.getElementById("myModal3").style.display = "block"
                // document.getElementById("myModal3").style.display = "block"
                // document.getElementById("myModal3").className += " show"
              }
              this.userInfo.spuseflg = "true";
              this.disablePause = true;
              this.userInfo.campaignPauseTime = "18:00";
              this.userInfo.campaignResumeTime = "06:00";
              this.userInfo.pushSec = data.pauseSec;
            }
          });
        }
      }
    }
  }

  closeModal() {
    document.getElementById("myModal3").style.display = "none"
    document.getElementById("myModal3").style.display = "none"
    document.getElementById("myModal3").className += document.getElementById("myModal3").className.replace("show", "")
  }

  // verify sender on tab
  onKey(fromName, value) {
    let tempFlg = 0;
    if (fromName !== this.lastSelection) {
      if (fromName != "" && this.lastSelection != null) {
        tempFlg = 0;
      } else {
        tempFlg = 1;
        //reset flag
      }
      // this.userInfo.spuseflg = "false";
      this.disablePause = false;
      this.lastSelection = fromName;
    } else {
      tempFlg = 1;
      // this.userInfo.spuseflg = "false";
      this.disablePause = false;
      //reset flag
    }

    for (let r in this.senderData) {
      if (this.senderData[r].senderId == fromName) {
        if (this.senderData[r].verificationStatus == 'pending' || this.senderData[r].verificationStatus == 'Pending') {
          this.userInfo.fromName = "";
          Swal.fire("Please verify sender");
        } else if (this.senderData[r].newDomain === 'Y' && this.senderData[r].day != null && this.senderData[r].day != '') {
          this.reputationDetails.newDomain = this.senderData[r].newDomain;
          this.reputationDetails.day = this.senderData[r].day;
          this.reputationDetails.emailAddress = this.senderData[r].emailAddress;
          let resp = this.emailService.getEmailCount(this.senderData[r].day);
          resp.subscribe(data => {
            if (data != null) {
              //disable flag && set  default value in pause n resume && yes 
              this.reputationDetails.numberOfEmail = data.numberOfEmail;
              if (tempFlg == 0) {
                // document.getElementById("myModal3").style.display = "block"
                // document.getElementById("myModal3").style.display = "block"
                // document.getElementById("myModal3").className += " show"
              }
              this.userInfo.spuseflg = "true";
              this.disablePause = true;
              this.userInfo.campaignPauseTime = "18:00";
              this.userInfo.campaignResumeTime = "06:00";
              this.userInfo.pushSec = data.pauseSec;
            }
          });
        }
      }
    }

  }


  // set process dessc
  setProcessDesc(event) {
    for (let r in this.processData) {
      if (this.processData[r].processId == this.userInfo.processName) {
        this.userInfo.processdesc = this.processData[r].processDescription;
      }

    }
  }

  changesRoleerror() {
    this.roleFlg = 1;
    for (let r in this.ListData) {
      if ($("#checkBox_" + r).is(":checked")) {
        this.roleFlg = 0;

      }
    }
  }


  HideShowInclude() {
    this.ShowHideInculdeList = [];
    this.includeflg = '0';
    for (let r in this.ListData) {
      if ($("#checkBox_" + r).is(":checked")) {
        this.showHidedata = {};

        if ($('#checkBox_' + r).val() == this.ListData[r].listId) {

          this.showHidedata.listId = $('#checkBox_' + r).val();
          this.showHidedata.customerId = this.customerId;
          this.ShowHideInculdeList.push(JSON.parse(JSON.stringify(this.showHidedata)))

          let resp = this.emailService.HideShowInclude(this.ShowHideInculdeList);
          resp.subscribe(data => {
            if (data == 0 || data == '0') {
              this.includeflg = '0';
            } else {
              this.includeflg = '1';
            }
          });

        }
      }
    }

  }

  checkRoute(pageName) {
    this.routePage = pageName;

  }



  // save Campaign 
  saveCampaign(createCampaign: NgForm) {
    this.ListName = [];
    this.roleFlg = 1;
    if (this.timeZoneSelection.length != 0) {
      this.userInfo.timeZone = this.timeZoneSelection[0].zoneName;
    } else {
      this.userInfo.timeZone = null;
    }
    for (let r in this.selectedItems) {
      this.roleFlg = 0;
      this.listTemp = {};
      this.listTemp.campaignName = this.userInfo.campaign;
      this.listTemp.processId = this.userInfo.processName;
      this.listTemp.senderId = this.userInfo.fromName;
      this.listTemp.emailTemplateSkey = this.userInfo.templateName;
      this.listTemp.subject = this.userInfo.subject;
      this.listTemp.pushSec = this.userInfo.pushSec;
      // this.trimTimezone();
      this.listTemp.timeZone = this.userInfo.timeZone;
      if (this.previewService.selecteCampaignIdList != null && this.previewService.selecteCampaignIdList != undefined && this.previewService.selecteCampaignIdList != "") {
        if (sessionStorage.getItem("Clone") != "Clone") {
          this.listTemp.campaignSkey = this.campaignData.campaign.campaignSkey;
          this.listTemp.campaignId = this.campaignData.campaign.campaignId;
          this.listTemp.createdOn = this.campaignData.campaign.createdOn;
          this.listTemp.status = this.campaignData.campaign.status;
        }
      }

      if (this.includeflg === '1') {
        if (this.userInfo.unsubscribe == true) {
          this.listTemp.unsubscribe = "1";
        } else {
          this.listTemp.unsubscribe = "0";
        }
        if (this.userInfo.softBounce == true) {
          this.listTemp.softBounce = "1";
        } else {
          this.listTemp.softBounce = "0";
        }
        if (this.userInfo.duplicate == true) {
          this.listTemp.duplicate = "1";
        } else {
          this.listTemp.duplicate = "0";
        }

        if (this.userInfo.skipWeekend == true) {
          this.listTemp.skipWeekend = "Y";
        } else {
          this.listTemp.skipWeekend = "N";
        }
        // week days
        var Weekdays = "";
        if (this.userInfo.Monday == true) {
          Weekdays = "Monday";
        } if (this.userInfo.Tuesday == true) {
          Weekdays = Weekdays + "," + "Tuesday";
        } if (this.userInfo.Wednesday == true) {
          Weekdays = Weekdays + "," + "Wednesday";
        }

        if (this.userInfo.Thursday == true) {
          Weekdays = Weekdays + "," + "Thursday";
        }

        if (this.userInfo.Friday == true) {
          Weekdays = Weekdays + "," + "Friday";
        }

        if (this.userInfo.Saturday == true) {
          Weekdays = Weekdays + "," + "Saturday";
        }

        if (this.userInfo.Sunday == true) {
          Weekdays = Weekdays + "," + "Sunday";
        }
        this.listTemp.weekends = Weekdays;
        //


      } else {

        // week days
        var Weekdays = "";
        if (this.userInfo.Monday == true) {
          Weekdays = "Monday";
        } if (this.userInfo.Tuesday == true) {
          Weekdays = Weekdays + "," + "Tuesday";
        }
        if (this.userInfo.Wednesday == true) {
          Weekdays = Weekdays + "," + "Wednesday";
        }

        if (this.userInfo.Thursday == true) {
          Weekdays = Weekdays + "," + "Thursday";
        }

        if (this.userInfo.Friday == true) {
          Weekdays = Weekdays + "," + "Friday";
        }

        if (this.userInfo.Saturday == true) {
          Weekdays = Weekdays + "," + "Saturday";
        }

        if (this.userInfo.Sunday == true) {
          Weekdays = Weekdays + "," + "Sunday";
        }
        this.listTemp.weekends = Weekdays;
        //

        //

        if (this.userInfo.duplicate == true) {
          this.listTemp.duplicate = "1";
        } else {
          this.listTemp.duplicate = "0";
        }

        if (this.userInfo.skipWeekend == true) {
          this.listTemp.skipWeekend = "Y";
        } else {
          this.listTemp.skipWeekend = "N";
        }
        if (this.userInfo.unsubscribe == true) {
          this.listTemp.unsubscribe = "1";
        } else {
          this.listTemp.unsubscribe = "0";
        }
        if (this.userInfo.softBounce == true) {
          this.listTemp.softBounce = "1";
        } else {
          this.listTemp.softBounce = "0";
        }
      }
      if (this.pausereadonly == true) {
        this.listTemp.campaignStatus = "Pause";
      } else {
        this.listTemp.campaignStatus = "Draft";
      }

      this.listTemp.campaignDescription = this.userInfo.campaigndesc;
      this.listTemp.customerId = this.customerId;
      this.listTemp.custCampaignId = this.userInfo.custCampaignId;
      this.listTemp.channelSkey = this.userInfo.channelName;

      if (this.userInfo.spuseflg == 'true') {
        this.listTemp.campaignPauseTime = this.userInfo.campaignPauseTime;
        this.listTemp.campaignResumeTime = this.userInfo.campaignResumeTime;

      } else {
        this.listTemp.campaignPauseTime = null;
        this.listTemp.campaignResumeTime = null;
      }

      if (this.userInfo.shchedule == "scheduleLater") {
        this.listTemp.campaignStartDate = this.userInfo.sheduleDate;
        var tempDate = this.userInfo.sheduleDate + "T" + this.userInfo.sheduleDateTime;
        this.listTemp.campaignStartDate = this.datepipe.transform((tempDate), "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
      } else {
        this.listTemp.campaignStartDate = "";
      }
      this.listTemp.scheduleCampaign = this.userInfo.shchedule;
      this.listTemp.listId = this.selectedItems[r].listId;
      this.ListName.push(this.listTemp);
    }

    if (this.ListName.length != 0) {
      if (this.timeZoneSelection.length != 0) {
        this.zone = true;
        this.submitFlg = true;

        let resp = this.emailService.saveCampaign(this.ListName);
        resp.subscribe(data => {
          if (data != null) {
            this.submitFlg = false;
            if (this.campNameflg == true) {
              Toast.fire({
                icon: 'success',
                title: 'Campaign updated sucessfully '
              })
              if (data.campaign.campaignStatus == "Pause") {
                this.router.navigate(['/campaign-management']);
              } else {
                this.router.navigate(['/configuration']);
              }

            } else {
              Toast.fire({
                icon: 'success',
                title: 'Campaign created sucessfully '
              })

              this.router.navigate(['/configuration']);

            }

            this.previewService.selecteCampaignIdList = data;
          } else {
            // error msg
          }

        });
      }
      else {
        this.zone = false;
      }
    } else {
      Swal.fire("Please select list");
    }
  }


  // save draft   
  saveDraft(createCampaign: NgForm) {
    if (this.timeZoneSelection.length != 0) {
      this.userInfo.timeZone = this.timeZoneSelection[0].zoneName;
    } else {
      this.userInfo.timeZone = null;
    }
    if (this.userInfo.campaign != null && this.userInfo.campaign != undefined && this.userInfo.campaign != "") {
      // chk regax
      this.ListName = [];
      this.roleFlg = 1;
      if (this.selectedItems != null && this.selectedItems.length != 0) {
        for (let r in this.selectedItems) {
          this.roleFlg = 0;
          this.listTemp = {};
          this.listTemp.campaignName = this.userInfo.campaign;
          this.listTemp.processId = this.userInfo.processName;
          this.listTemp.senderId = this.userInfo.fromName;
          this.listTemp.emailTemplateSkey = this.userInfo.templateName;
          this.listTemp.subject = this.userInfo.subject;
          this.listTemp.pushSec = this.userInfo.pushSec;
          // this.trimTimezone();
          this.listTemp.timeZone = this.userInfo.timeZone;
          if (this.previewService.selecteCampaignIdList != null && this.previewService.selecteCampaignIdList != undefined && this.previewService.selecteCampaignIdList != "") {
            if (sessionStorage.getItem("Clone") != "Clone") {
              this.listTemp.campaignSkey = this.campaignData.campaign.campaignSkey;
              this.listTemp.campaignId = this.campaignData.campaign.campaignId;
              this.listTemp.createdOn = this.campaignData.campaign.createdOn;
              this.listTemp.status = this.campaignData.campaign.status;
            }
          }
          this.listTemp.custCampaignId = this.userInfo.custCampaignId;
          if (this.includeflg === '1') {
            if (this.userInfo.unsubscribe == true) {
              this.listTemp.unsubscribe = "1";
            } else {
              this.listTemp.unsubscribe = "0";
            }
            if (this.userInfo.softBounce == true) {
              this.listTemp.softBounce = "1";
            } else {
              this.listTemp.softBounce = "0";
            }
            if (this.userInfo.duplicate == true) {
              this.listTemp.duplicate = "1";
            } else {
              this.listTemp.duplicate = "0";
            }

            if (this.userInfo.skipWeekend == true) {
              this.listTemp.skipWeekend = "Y";
            } else {
              this.listTemp.skipWeekend = "N";
            }

            // week days
            var Weekdays = "";
            if (this.userInfo.Monday == true) {
              Weekdays = "Monday";
            } if (this.userInfo.Tuesday == true) {
              Weekdays = Weekdays + "," + "Tuesday";
            }
            if (this.userInfo.Wednesday == true) {
              Weekdays = Weekdays + "," + "Wednesday";
            }

            if (this.userInfo.Thursday == true) {
              Weekdays = Weekdays + "," + "Thursday";
            }

            if (this.userInfo.Friday == true) {
              Weekdays = Weekdays + "," + "Friday";
            }

            if (this.userInfo.Saturday == true) {
              Weekdays = Weekdays + "," + "Saturday";
            }

            if (this.userInfo.Sunday == true) {
              Weekdays = Weekdays + "," + "Sunday";
            }
            this.listTemp.weekends = Weekdays;
            //
          } else {

            // week days
            var Weekdays = "";
            if (this.userInfo.Monday == true) {
              Weekdays = "Monday";
            } if (this.userInfo.Tuesday == true) {
              Weekdays = Weekdays + "," + "Tuesday";
            }
            if (this.userInfo.Wednesday == true) {
              Weekdays = Weekdays + "," + "Wednesday";
            }

            if (this.userInfo.Thursday == true) {
              Weekdays = Weekdays + "," + "Thursday";
            }

            if (this.userInfo.Friday == true) {
              Weekdays = Weekdays + "," + "Friday";
            }

            if (this.userInfo.Saturday == true) {
              Weekdays = Weekdays + "," + "Saturday";
            }

            if (this.userInfo.Sunday == true) {
              Weekdays = Weekdays + "," + "Sunday";
            }
            this.listTemp.weekends = Weekdays;
            //
            if (this.userInfo.duplicate == true) {
              this.listTemp.duplicate = "1";
            } else {
              this.listTemp.duplicate = "0";
            }

            if (this.userInfo.skipWeekend == true) {
              this.listTemp.skipWeekend = "Y";
            } else {
              this.listTemp.skipWeekend = "N";
            }
            if (this.userInfo.unsubscribe == true) {
              this.listTemp.unsubscribe = "1";
            } else {
              this.listTemp.unsubscribe = "0";
            }
            if (this.userInfo.softBounce == true) {
              this.listTemp.softBounce = "1";
            } else {
              this.listTemp.softBounce = "0";
            }
          }
          this.listTemp.campaignStatus = "Draft";
          this.listTemp.campaignDescription = this.userInfo.campaigndesc;
          this.listTemp.customerId = this.customerId;
          this.listTemp.channelSkey = this.userInfo.channelName;


          if (this.userInfo.shchedule == "scheduleLater") {
            this.listTemp.campaignStartDate = this.userInfo.sheduleDate;
            var tempDate = this.userInfo.sheduleDate + "T" + this.userInfo.sheduleDateTime;
            this.listTemp.campaignStartDate = this.datepipe.transform(tempDate, "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
          } else {
            this.listTemp.campaignStartDate = "";
          }



          if (this.userInfo.spuseflg == 'true') {
            this.listTemp.campaignPauseTime = this.userInfo.campaignPauseTime;
            this.listTemp.campaignResumeTime = this.userInfo.campaignResumeTime;

          } else {
            this.listTemp.campaignPauseTime = null;
            this.listTemp.campaignResumeTime = null;
          }
          this.listTemp.scheduleCampaign = this.userInfo.shchedule;
          this.listTemp.listId = this.selectedItems[r].listId;
          this.ListName.push(this.listTemp);
        }
      } else {
        this.listTemp = {};
        this.listTemp.campaignName = this.userInfo.campaign;
        this.listTemp.processId = this.userInfo.processName;
        this.listTemp.senderId = this.userInfo.fromName;
        this.listTemp.emailTemplateSkey = this.userInfo.templateName;
        this.listTemp.subject = this.userInfo.subject;
        this.listTemp.pushSec = this.userInfo.pushSec;
        if (this.previewService.selecteCampaignIdList != null && this.previewService.selecteCampaignIdList != undefined && this.previewService.selecteCampaignIdList != "") {
          if (sessionStorage.getItem("Clone") != "Clone") {
            this.listTemp.campaignSkey = this.campaignData.campaign.campaignSkey;
            this.listTemp.campaignId = this.campaignData.campaign.campaignId;
            this.listTemp.createdOn = this.campaignData.campaign.createdOn;
            this.listTemp.status = this.campaignData.campaign.status;
          }
        }

        if (this.includeflg === '1') {
          if (this.userInfo.unsubscribe == true) {
            this.listTemp.unsubscribe = "1";
          } else {
            this.listTemp.unsubscribe = "0";
          }
          if (this.userInfo.softBounce == true) {
            this.listTemp.softBounce = "1";
          } else {
            this.listTemp.softBounce = "0";
          }
          if (this.userInfo.duplicate == true) {
            this.listTemp.duplicate = "1";
          } else {
            this.listTemp.duplicate = "0";
          }

          if (this.userInfo.skipWeekend == true) {
            this.listTemp.skipWeekend = "Y";
          } else {
            this.listTemp.skipWeekend = "N";
          }

          // week days
          var Weekdays = "";
          if (this.userInfo.Monday == true) {
            Weekdays = "Monday";
          } if (this.userInfo.Tuesday == true) {
            Weekdays = Weekdays + "," + "Tuesday";
          }
          if (this.userInfo.Wednesday == true) {
            Weekdays = Weekdays + "," + "Wednesday";
          }

          if (this.userInfo.Thursday == true) {
            Weekdays = Weekdays + "," + "Thursday";
          }

          if (this.userInfo.Friday == true) {
            Weekdays = Weekdays + "," + "Friday";
          }

          if (this.userInfo.Saturday == true) {
            Weekdays = Weekdays + "," + "Saturday";
          }

          if (this.userInfo.Sunday == true) {
            Weekdays = Weekdays + "," + "Sunday";
          }
          this.listTemp.weekends = Weekdays;
          //
        } else {

          // week days
          var Weekdays = "";
          if (this.userInfo.Monday == true) {
            Weekdays = "Monday";
          } if (this.userInfo.Tuesday == true) {
            Weekdays = Weekdays + "," + "Tuesday";
          }
          if (this.userInfo.Wednesday == true) {
            Weekdays = Weekdays + "," + "Wednesday";
          }

          if (this.userInfo.Thursday == true) {
            Weekdays = Weekdays + "," + "Thursday";
          }

          if (this.userInfo.Friday == true) {
            Weekdays = Weekdays + "," + "Friday";
          }

          if (this.userInfo.Saturday == true) {
            Weekdays = Weekdays + "," + "Saturday";
          }

          if (this.userInfo.Sunday == true) {
            Weekdays = Weekdays + "," + "Sunday";
          }
          this.listTemp.weekends = Weekdays;
          //
          if (this.userInfo.duplicate == true) {
            this.listTemp.duplicate = "1";
          } else {
            this.listTemp.duplicate = "0";
          }

          if (this.userInfo.skipWeekend == true) {
            this.listTemp.skipWeekend = "Y";
          } else {
            this.listTemp.skipWeekend = "N";
          }
          if (this.userInfo.unsubscribe == true) {
            this.listTemp.unsubscribe = "1";
          } else {
            this.listTemp.unsubscribe = "0";
          }
          if (this.userInfo.softBounce == true) {
            this.listTemp.softBounce = "1";
          } else {
            this.listTemp.softBounce = "0";
          }
        }
        this.listTemp.campaignStatus = "Draft";
        this.listTemp.campaignDescription = this.userInfo.campaigndesc;
        this.listTemp.customerId = this.customerId;
        this.listTemp.channelSkey = this.userInfo.channelName;
        // this.trimTimezone();
        this.listTemp.timeZone = this.userInfo.timeZone;

        if (this.userInfo.shchedule == "scheduleLater") {
          this.listTemp.campaignStartDate = this.userInfo.sheduleDate;
          var tempDate = this.userInfo.sheduleDate + "T" + this.userInfo.sheduleDateTime;
          this.listTemp.campaignStartDate = this.datepipe.transform(tempDate, "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        } else {
          this.listTemp.campaignStartDate = "";
        }



        if (this.userInfo.spuseflg == 'true') {
          this.listTemp.campaignPauseTime = this.userInfo.campaignPauseTime;
          this.listTemp.campaignResumeTime = this.userInfo.campaignResumeTime;

        } else {
          this.listTemp.campaignPauseTime = null;
          this.listTemp.campaignResumeTime = null;
        }
        this.listTemp.scheduleCampaign = this.userInfo.shchedule;
        this.ListName.push(this.listTemp);
      }
      if (this.ListName.length != 0) {
        this.submitFlg = true;
        let resp = this.emailService.saveCampaign(this.ListName);
        resp.subscribe(data => {
          if (data != 0) {
            this.submitFlg = false;
            if (this.routePage == "campDashboard") {
              this.router.navigate(['/campaign-management']);
            } else if (this.routePage == "Template") {
              this.previewService.campaignRouting = "campDashboard";
              this.router.navigate(['/create-template']);
            } else if (this.routePage == "Sender") {
              this.previewService.campaignRouting = "campDashboard";
              this.router.navigate(['/add-sender']);
            } else if (this.routePage == "Process") {
              this.previewService.campaignRouting = "campDashboard";
              this.router.navigate(['/create-process']);
            } else if (this.routePage == "List") {
              this.previewService.campaignRouting = "campDashboard";
              this.router.navigate(['/create-list']);
            }
          }
        });

      }

    } else {
      Swal.fire("Please enter campaign name");
    }
  }

  redirectToCampaignManagemnetNO() {
    if (this.routePage == "campDashboard") {
      this.router.navigate(['/campaign-management']);
    } else if (this.routePage == "Template") {
      this.previewService.campaignRouting = "campDashboard";
      this.router.navigate(['/create-template']);
    } else if (this.routePage == "Sender") {
      this.previewService.campaignRouting = "campDashboard";
      this.router.navigate(['/add-sender']);
    } else if (this.routePage == "Process") {
      this.previewService.campaignRouting = "campDashboard";
      this.router.navigate(['/create-process']);
    } else if (this.routePage == "List") {
      this.previewService.campaignRouting = "campDashboard";
      this.router.navigate(['/create-list']);
    } else {
      this.router.navigate(['/campaign-management']);
    }
    sessionStorage.setItem("Clone", null);
  }

  timeZone() {
    let resp = this.emailService.timeZone();
    resp.subscribe(data => {
      if (data != 0) {
        this.timeZoneList = data;
        this.timeZoneSelection = [];
        if (sessionStorage.getItem("timezone") != null && sessionStorage.getItem("timezone") != "" && sessionStorage.getItem("timezone") != undefined) {
          this.timeZoneTemp = {};
          for (let n in this.timeZoneList) {
            if (this.timeZoneList[n].zoneName == sessionStorage.getItem("timezone")) {
              this.timeZoneTemp.zoneDetails = this.timeZoneList[n].zoneDetails;
            }
          }
          this.timeZoneTemp.zoneName = sessionStorage.getItem("timezone");
          this.timeZoneSelection.push(this.timeZoneTemp);
        }
        this.getAllList();
      }
    });
  }

  // timeZoneValidation() {
  //   this.zone = false;
  //   if (this.timeZoneSelection == null || this.timeZoneSelection.length == 0) {
  //     console.log(this.timeZoneSelection);
  //     this.zone = true;
  //   }
  //   else {
  //     console.log(this.timeZoneSelection, "**");
  //     this.zone = false;
  //   }
  // }

  onZoneSelect(item: any) {
    if (this.timeZoneSelection.length != 0) {
      this.zone = true;
    }
    else {
      this.zone = false;
    }
  }

  // checkzone() {
  //   // if (this.userInfo.shchedule == 'scheduleLater' || this.userInfo.spuseflg == 'true' || this.userInfo.skipWeekend == true) {
  //   this.checkChangeFlg();
  //   var temp = 0;
  //   this.zone = false;
  //   var tempzone = JSON.parse(JSON.stringify(this.userInfo.timeZone)).trim();
  //   tempzone = tempzone.replace(/ *\([^)]*\) */g, "");
  //   for (let i in this.timeZoneList) {
  //     if (tempzone == (this.timeZoneList[i].zoneName)) {
  //       this.zone = true;
  //       temp = 1;
  //     }
  //     // else{
  //     //   this.zone = false;
  //     // }        
  //   }
  //   if (temp == 0) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  //   // } else {
  //   //   return true;
  //   // }
  // }

  checkSelected() {
    if (this.userInfo.Monday === true && this.userInfo.Tuesday === true &&
      this.userInfo.Wednesday === true &&
      this.userInfo.Thursday === true && this.userInfo.Friday === true &&
      this.userInfo.Saturday === true && this.userInfo.Sunday === true) {
        Swal.fire("You cannot select all days to exclude")
    }
    else {
      if (this.userInfo.Monday === true || this.userInfo.Tuesday === true || this.userInfo.Wednesday === true ||
        this.userInfo.Thursday === true || this.userInfo.Friday === true ||
        this.userInfo.Saturday === true || this.userInfo.Sunday === true) {
        this.userInfo.skipWeekend = true;
        $("#weekend").prop("checked", true);
        this.weekendFlag = true;
        var allWeekdays = "";
        if (this.userInfo.Monday == true) {
          allWeekdays = allWeekdays + "," +"Monday";
        }
        if (this.userInfo.Tuesday == true) {
          allWeekdays = allWeekdays + "," + "Tuesday";
        }
        if (this.userInfo.Wednesday == true) {
          allWeekdays = allWeekdays + "," + "Wednesday";
        }
        if (this.userInfo.Thursday == true) {
          allWeekdays = allWeekdays + "," + "Thursday";
        }
        if (this.userInfo.Friday == true) {
          allWeekdays = allWeekdays + "," + "Friday";
        }
        if (this.userInfo.Saturday == true) {
          allWeekdays = allWeekdays + "," + "Saturday";
        }
        if (this.userInfo.Sunday == true) {
          allWeekdays = allWeekdays + "," + "Sunday";
        }
        this.weekendList.weekends = allWeekdays;
        this.weekendList.weekends =this.weekendList.weekends.replace(/,/i, "");
        this.closeModalModal2();
      } else {
        this.userInfo.skipWeekend = false;
        $("#weekend").prop("checked", false);
        this.closeModalModal2();
      }
    }
  }

  selectDeselect() {
    if (($("#weekend").prop("checked", true)) &&
      (this.userInfo.Monday == true || this.userInfo.Tuesday == true || this.userInfo.Wednesday == true ||
        this.userInfo.Thursday == true || this.userInfo.Friday == true ||
        this.userInfo.Saturday == true || this.userInfo.Sunday == true)) {
      $("#weekend").prop("checked", false);
      this.userInfo.Monday = false;
      this.userInfo.Tuesday = false;
      this.userInfo.Wednesday = false;
      this.userInfo.Thursday = false;
      this.userInfo.Friday = false;
      this.userInfo.Saturday = false;
      this.userInfo.Sunday = false;
      this.userInfo.skipWeekend = false;
      this.weekendFlag = false;
      // document.getElementById("myModal2").style.display = "none"
      // document.getElementById("myModal2").style.display = "none"
      // document.getElementById("myModal2").className += document.getElementById("myModal2").className.replace("show", " ")
    } else
      if ($("#weekend").prop("checked", true)) {
        this.userInfo.skipWeekend = true;
        document.getElementById("myModal2").style.display = "block"
        document.getElementById("myModal2").style.display = "block"
        document.getElementById("myModal2").className += " show"
      }
  }

  closeModalModal2() {
    document.getElementById("myModal2").style.display = "none"
    document.getElementById("myModal2").style.display = "none"
    document.getElementById("myModal2").className += document.getElementById("myModal2").className.replace(" show", " ")
  }

  trimTimezone() {
    var str = (this.userInfo.timeZone).trim();;
    str = str.replace(/ *\([^)]*\) */g, "");
    this.userInfo.timeZone = str;
    this.listTemp.timeZone = (this.userInfo.timeZone).trim();;
  }

}
