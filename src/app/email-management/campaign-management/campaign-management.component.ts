import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location, DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { OrderPipe } from 'ngx-order-pipe';
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


declare var $;

@Component({
  selector: 'app-campaign-management',
  templateUrl: './campaign-management.component.html',
  styleUrls: ['./campaign-management.component.css']
})
export class CampaignManagementComponent implements OnInit {

  selectedRow: any;
  checkboxes: boolean[];
  campDatatable: any = {};
  campaignList: any = [];
  //date filter
  dobflag1 = false;
  dobflag2 = false;
  dateFilterFlg = false;
  min1: string;
  min2: string;
  duplicateArray = [];
  campaignDetails = [];
  option: any;
  editflg = false;
  dashboardListInternalList: any[];
  allCampaignList: any = [];
  order: string = 'campaign.campaignId';
  reverse: boolean = true;
  // caseInsensitive : boolean = false;
  dateApply = false;


  filterstatus = "";

  // Select filter 

  filter = ['Draft', 'Sheduled', 'Sending', 'completed'];


  form: FormGroup

  formData = {
    startDate: "",
    endDate: ""
  };

  nodataFlg = false;

  // Table aray

  userData: any = [];
  submitted = false;

  deleteCamp = {
    campaignSkey: "",
    status: "",
    archive: ""
  };
  archiveCamp: any;

  search;
  private term: string = "";
  i;

  //Pagination
  p = 1;
  showData = {
    //rows Per Page
    rowsPerPage: 5
  };

  //Select all checkbox
  title: String;
  selectedAll: any;
  selecteCampaignIdList: any;
  blackList: any[];
  archive: any;
  archiveList: any[];
  optionList: any = {};
  ListnameData: any[];

  //table selection
  selectName = true;
  selectDesc = true;
  selectProcess = true;
  selectList = true;
  selectTemplate = true;
  selectStatus = true;
  selectAction = true;

  constructor(public datepipe: DatePipe, private router: Router, private location: Location, private fb: FormBuilder, private emailService: EmailManaementService, private previewService: PreviewService, private orderPipe: OrderPipe) {
    this.createForm();
    this.title = "Select all/Deselect all checkbox ";
  }


  ngOnInit(): void {
    this.campaignDetails = this.userData
    this.minAgeFrom();
    this.getAllCampaignList();
    this.getviewSelectionMemory();
  }

  filterStatus() {
    this.search = this.filterstatus;
  }


  setClickedRow(index) {
    this.selectedRow = index;
  }

  checkIfAllSelected() {
    this.selectedAll = this.userData.every(function (item: any) {
      return item.selected == true;
    })
  }
  //end code

  ViewCampaign(campaigndata) {
    if (campaigndata.campaign.historyFlg != null && campaigndata.campaign.historyFlg == "1") {
      let resp = this.emailService.getFactCampainHistoryCount(campaigndata.campaign.campaignId);
      resp.subscribe(data => {
        if (data != null && data != '0' && data != 0) {
          sessionStorage.setItem("campaignId", campaigndata.campaign.campaignId);
          sessionStorage.setItem("commingFrom", "CampmanagementView");
          campaigndata.mailsentCount = Number(data);
          this.previewService.ViewCampaignList = campaigndata;
          this.previewService.historyFlg = campaigndata.campaign.historyFlg;
          this.router.navigate(['/view-campaign']);
        } else {
          Swal.fire("Zero report found");
        }
      });
    } else {
      let resp = this.emailService.getFactCampainCount(campaigndata.campaign.campaignId);
      resp.subscribe(data => {
        if (data != null && data != '0' && data != 0) {
          sessionStorage.setItem("campaignId", campaigndata.campaign.campaignId);
          sessionStorage.setItem("commingFrom", "CampmanagementView");
          campaigndata.mailsentCount = Number(data);
          this.previewService.ViewCampaignList = campaigndata;
          this.previewService.historyFlg = campaigndata.campaign.historyFlg;
          this.router.navigate(['/view-campaign']);
        } else {
          Swal.fire("Zero report found");
        }
      });
    }
  }

  //Form submit button
  onSubmit() { this.submitted = true; }

  pauseCampaign(campaign) {
    Swal.fire({
      title: ' Pause',
      text: "Are you sure want to pause this campaign?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      let resp = this.emailService.pauseCampaign(campaign.campaignId);
      resp.subscribe(data => {
        if (result.isConfirmed) {
          if (data != null && data == "1") {
            Swal.fire('Paused', '', 'success')
            this.getAllCampaignList();
          }
        }
      })
    });
  }

  resumeCampaign(campaign) {
    Swal.fire({
      title: ' Resume',
      text: "Do you want to resume this campaign?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
      let resp = this.emailService.resumeCampaign(campaign);
      resp.subscribe(data => {
          if (data != null && data == "1") {
            Swal.fire('Request submitted successfully, please refresh the page', '', 'success')
            this.getAllCampaignList();
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Week-End',
              text: 'You set today as weekend!',
             footer: '*We run campaign on week days only'
            })
          }
      })
    }
    });
  }

  //mark as completed

  markAsResume(campaignId) {
    // console.log(campaignId);

    Swal.fire({
      title: ' Close campaign',
      text: "Do you want to mark this campaign as completed?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        let resp = this.emailService.markAsCompletedCampaign(campaignId);
        resp.subscribe(data => {
          if (data != null) {
            Swal.fire('Completed', '', 'success')
            this.getAllCampaignList();
          }
        })
      }

    });
  }

  redirectToCreateCampaignngmnt() {
    this.previewService.selecteCampaignIdList = "";
    this.previewService.campaignRouting = "";
    this.previewService.selectedCampaignIdListRouting = null;
    this.previewService.selectedroutingList = null;
    sessionStorage.setItem("Clone", null);
    this.router.navigate(['/create-campaign']);
  }
  createForm() {
    this.form = this.fb.group({
      dateTo: ['', Validators.required],
      dateFrom: ['', Validators.required]
    }, { validator: this.dateLessThan('dateFrom', 'dateTo') });
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        this.dateApply = true;
        return {
          dates: "Start date should be less than end date"
        };
      }
      this.dateApply = false;
      return {};
    }
  }

  //date filter
  reverseAndTimeStamp(dateString) {
    let d1 = this.datepipe.transform(dateString, "yyyy-MM-dd");
    return d1;
  }

  // date filter
  filterDate() {
    this.campaignList = [];

    this.dateValid1();
    this.dateValid2();

    let fr = this.datepipe.transform(this.formData.startDate, "yyyy-MM-ddThh:mm");
    let to = this.datepipe.transform(this.formData.endDate, "yyyy-MM-ddThh:mm");

    if (this.formData.startDate != null && this.formData.startDate != undefined && this.formData.startDate != ""
      && this.formData.endDate != null && this.formData.endDate != undefined && this.formData.endDate != "") {
      this.dateFilterFlg = true;
      let selectedMembers = this.allCampaignList.filter(f =>
        new Date(this.reverseAndTimeStamp(f.campaign.createdOn)) >= new Date(this.formData.startDate)
        && new Date(this.reverseAndTimeStamp(f.campaign.createdOn)) <= new Date(this.formData.endDate));

      this.campaignList = selectedMembers;
      if(this.campaignList.length == 0){
        this.nodataFlg = true;
      }
      else{
        this.nodataFlg = false;
      }
    }
    else {
      this.campaignList = this.allCampaignList
    }
  }

  reset() {
    this.formData.startDate = "";
    this.formData.endDate = "";
    this.campaignList = this.allCampaignList;
    if(this.campaignList.length == 0){
      this.nodataFlg = true;
    }
    else{
      this.nodataFlg = false;
    }
    this.dobflag1 = false;
    this.dobflag2 = false;
  }

  dateValid1() {
    if (this.formData.startDate == null || this.formData.startDate == undefined || this.formData.startDate == "") {
      this.dobflag1 = true;
    } else {
      this.dobflag1 = false;
    }
  }

  dateValid2() {
    if (this.formData.endDate == null || this.formData.endDate == undefined || this.formData.endDate == "") {
      this.dobflag2 = true;
    } else {
      this.dobflag2 = false;
    }
  }

  //APi Integration
  getAllCampaignList() {
    this.campaignList = [];
    this.nodataFlg = false;
    let resp = this.emailService.getAllCampaignList();
    resp.subscribe(data => {
      if (data != 0) {
        this.campaignList = [];
        this.allCampaignList = [];
        for (let i in data) {
          if (data[i].campaign.archive != '1') {
            this.campaignList.push(data[i]);
            this.allCampaignList.push(data[i]);
          }
        }
      } else {
        this.nodataFlg = true;
      }
    });
  }

  showListDetails(camp) {
    this.ListnameData = [];
    this.optionList = {};
    for (let i in camp.campaignListMap) {

      this.optionList.listName = JSON.parse(JSON.stringify(camp.campaignListMap[i].dimList.listName));
      this.optionList.listId = JSON.parse(JSON.stringify(camp.campaignListMap[i].dimList.listId))

      this.ListnameData.push(JSON.parse(JSON.stringify(this.optionList)));
    }
  }


  UpdateCampaignngmnt(camp) {
    this.previewService.selecteCampaignIdList = camp;
    this.previewService.selectedCampaignIdListRouting = null;
    this.previewService.selectedroutingList = null;
    sessionStorage.setItem("Clone", null);
    this.router.navigate(['/create-campaign']);
  }

  // clone campaign
  CloneCampaign(camp, Clone) {
    this.previewService.selecteCampaignIdList = camp;
    sessionStorage.setItem("Clone", Clone);
    this.previewService.selectedCampaignIdListRouting = null;
    this.previewService.selectedroutingList = null;

    let msg = '';
    let BtnMsg = '';

    msg = "You want to clone this campaign";
    BtnMsg = "clone";
    Swal.fire({
      title: 'Are You Sure?',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + BtnMsg + ' it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/create-campaign']);
      }
    })
  }




  deletecampaign(campaignSkey, archive) {
    this.deleteCamp.campaignSkey = campaignSkey;
    this.deleteCamp.archive = archive;

    let msg = '';
    let BtnMsg = '';

    this.deleteCamp.status = "0";
    msg = "You won't be able to revert this";
    BtnMsg = "delete";

    Swal.fire({
      title: 'Are You Sure?',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + BtnMsg + ' it'
    }).then((result) => {
      if (result.isConfirmed) {
        let resp = this.emailService.deleteCampaign(this.deleteCamp);
        resp.subscribe(data => {
          if (data != 0) {
            this.getAllCampaignList();
            Swal.fire(
              'Deleted!',
              'Your campaign has been deleted.',
              'success'
            )
          }
        });
      }
    })
  }

  selectAll() {
    if ($("#allcheck").is(":checked")) {
      for (let i in this.campaignList) {
        $("#check_" + this.campaignList[i].campaign.campaignSkey).prop("checked", true);
      }
    } else {
      for (let i in this.campaignList) {
        $("#check_" + this.campaignList[i].campaign.campaignSkey).prop("checked", false);
      }
    }
  }

  toggleSelection(event, i) {
    // this.checkboxes[i] = event.target.checked;
  }

  blackListProcess() {
    this.archiveCamp = {};
    this.archiveList = [];
    for (let i in this.campaignList) {
      if ($("#check_" + this.campaignList[i].campaign.campaignSkey).is(":checked")) {
        this.archiveCamp.campaignSkey = JSON.parse(JSON.stringify(this.campaignList[i].campaign.campaignSkey));
        this.archiveCamp.archive = "1";
        this.archiveCamp.status = JSON.parse(JSON.stringify(this.campaignList[i].campaign.status));
        this.archiveList.push(JSON.parse(JSON.stringify(this.archiveCamp)));
      }
    }

    if (this.archiveList.length != 0) {
      Swal.fire({
        title: this.archiveList.length + ' record selected',
        text: "Are you sure you want to archive?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Archive it'
      }).then((result) => {
        if (result.isConfirmed) {

          let resp = this.emailService.ArchiveCampaign(this.archiveList);
          resp.subscribe(data => {
            if (data != 0) {
              Swal.fire(
                'Archive',
                'Campaign has been archived',
                'success'
              )
              this.getAllCampaignList();
            }

          });

        }
      })
    } else {
      Swal.fire("Please select atleast one campaign");
    }

  }

  minAgeFrom() {
    let today = new Date();
    var tod = moment(today).format("DD-MM-YYYY");
    let temp = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this.min2 = moment(temp).format("YYYY-MM-DD");
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
      // this.caseInsensitive  = ! this.caseInsensitive; 
    }
    this.order = value;
  }

  refresh() {
    this.getAllCampaignList();
  }

  viewSelectionMemory() {
    sessionStorage.setItem("selectName", String(this.selectName));
    sessionStorage.setItem("selectDesc", String(this.selectDesc));
    sessionStorage.setItem("selectProcess", String(this.selectProcess));
    sessionStorage.setItem("selectList", String(this.selectList));
    sessionStorage.setItem("selectTemplate", String(this.selectTemplate));
    sessionStorage.setItem("selecStatus", String(this.selectStatus));
    sessionStorage.setItem("selectAction", String(this.selectAction));
  }

  getviewSelectionMemory() {
    if (sessionStorage.getItem("selectName") != null && sessionStorage.getItem("selectName") != undefined) {
      this.selectName =  JSON.parse(sessionStorage.getItem("selectName"));
    }
    if (sessionStorage.getItem("selectDesc") != null && sessionStorage.getItem("selectDesc") != undefined) {
      this.selectDesc =  JSON.parse(sessionStorage.getItem("selectDesc"));
    }
    if (sessionStorage.getItem("selectProcess") != null && sessionStorage.getItem("selectProcess") != undefined) {
      this.selectProcess =  JSON.parse(sessionStorage.getItem("selectProcess"));
    }
    if (sessionStorage.getItem("selectList") != null && sessionStorage.getItem("selectList") != undefined) {
      this.selectList =  JSON.parse(sessionStorage.getItem("selectList"));
    }
    if (sessionStorage.getItem("selectTemplate") != null && sessionStorage.getItem("selectTemplate") != undefined) {
      this.selectTemplate = JSON.parse(sessionStorage.getItem("selectTemplate"));
    }
    if (sessionStorage.getItem("selectStatus") != null && sessionStorage.getItem("selectStatus") != undefined) {
      this.selectStatus =  JSON.parse(sessionStorage.getItem("selectStatus"));
    }
    if (sessionStorage.getItem("selectAction") != null && sessionStorage.getItem("selectAction") != undefined) {
      this.selectAction =  JSON.parse(sessionStorage.getItem("selectAction"));
    }
  }


}
