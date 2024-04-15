import { Component, OnInit } from '@angular/core';
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';
import * as moment from 'moment';

@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['./view-campaign.component.css']
})
export class ViewCampaignComponent implements OnInit {

  campaignData: any;
  campaignId: any;
  ListData: any;
  campViewTableData: any = [];
  opencount: any;
  clickCount: any;
  subscribeCount: any;
  campViewData: any = {};
  itrationCount = null;
  order: string = 'emailAddress';
  reverse: boolean = true;

  search;
  chkName = '1';
  private term: string = "";
  i;

  //Pagination
  p = 1;
  showData = {
    //rows Per Page
    rowsPerPage: 10
  };
  CamptList: any = {};
  campcsvData: any[];
  commingFrom: string;
  customerClientList: any = [];
  downloadCustomerData: any = [];
  constructor(private router: Router, private emailService: EmailManaementService, private previewService: PreviewService, private orderPipe: OrderPipe) {
    this.commingFrom = sessionStorage.getItem("commingFrom");
    if (this.previewService.ViewCampaignList != null && this.previewService.ViewCampaignList != undefined && this.previewService.ViewCampaignList != "") {
      this.getAllList();
      this.getCampainView();
      this.getCampainViewCount();
    } else if (this.commingFrom == "Dashboard") {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/campaign-management']);
    }
  }

  ngOnInit(): void {

  }


  getCampainView() {
    this.campViewTableData = [];
    let startNo = 0;
    this.itrationCount = 1;
    let size = 500;
    let count = Number(this.previewService.ViewCampaignList.mailsentCount);
    let itration = Math.ceil(count / size);
    for (var i = 0; i < itration; i++) {
      this.itrationCount++;
      if (i != 0) {
        startNo = size + startNo;
      }

      if (this.previewService.historyFlg == "1") {
        let resp = this.emailService.getCampainHistoryView(startNo, size);
        resp.subscribe(data => {
          this.itrationCount--;
          if (data != null && data != '') {
            for (let i in data) {
              this.campViewTableData.push(data[i]);
            }
            // this.campViewTableData = data;
          }
        });
      } else {

        let resp = this.emailService.getCampainView(startNo, size);
        resp.subscribe(data => {
          this.itrationCount--;
          if (data != null && data != '') {
            for (let i in data) {
              this.campViewTableData.push(data[i]);
            }
            // this.campViewTableData = data; 
          }
        });
      }

    }
  }

  getCampainViewCount() {
    if (this.previewService.historyFlg == "1") {
      let resp = this.emailService.getCampainHistoryViewCount();
      resp.subscribe(data => {
        if (data != null && data != '') {
          this.opencount = data.openCount;
          this.clickCount = data.clickCount;
          this.subscribeCount = data.subscribeCount;
        }

      });

    } else {
      let resp = this.emailService.getCampainViewCount();
      resp.subscribe(data => {
        if (data != null && data != '') {
          this.opencount = data.openCount;
          this.clickCount = data.clickCount;
          this.subscribeCount = data.subscribeCount;
        }

      });
    }
  }

  SetData() {
    this.campaignData = this.previewService.ViewCampaignList;
    this.campaignId = this.campaignData.campaign.campaignId;
    this.campViewData.campaignName = this.campaignData.campaign.campaignName;
    this.campViewData.campaignStatus = this.campaignData.campaign.campaignStatus;
    this.campViewData.campaignStartDate = this.campaignData.campaign.campaignStartDate;
    this.campViewData.subject = this.campaignData.campaign.subject;
    if (this.campaignData.campaign.senderId = this.campaignData.sender.senderId) {
      this.campViewData.sentfromAddress = this.campaignData.sender.emailAddress;
    }

    let Listname = "";
    for (let i in this.campaignData.campaignListMap) {
      for (let r in this.ListData) {
        if (this.ListData[r].listId == this.campaignData.campaignListMap[i].dimList.listId) {
          Listname = Listname + "," + this.campaignData.campaignListMap[i].dimList.listName;
        }
      }
    }
    var myListName = Listname;
    if (myListName.charAt(0) === ',') {
      myListName = myListName.slice(1);
      this.campViewData.Listname = myListName;
    }

  }

  setDashboarddata() {
    this.campaignData = this.previewService.ViewCampaignList;
    this.campaignId = this.campaignData.campaignId;
    this.campViewData.campaignName = this.campaignData.campaignName;
    this.campViewData.campaignStatus = this.campaignData.campaignStatus;
    this.campViewData.campaignStartDate = this.campaignData.campaignStartDate;
    this.campViewData.subject = this.campaignData.subject;
    this.campViewData.sentfromAddress = this.campaignData.senderEmailAddress;
    this.campViewData.Listname = this.campaignData.Listname
  }

  getAllList() {
    let resp = this.emailService.getAllList();
    resp.subscribe(data => {
      if (data != null && data != '') {
        this.ListData = data;
        if (this.commingFrom == "Dashboard") {
          this.setDashboarddata();
        } else if (this.commingFrom == "CampmanagementView") {
          this.SetData();
        }
      }

    });
  }

  // download .csv Report
  download() {
    this.customerClientList = [];
    this.downloadCustomerData = [];
    // console.log(this.campViewTableData, "**");


    for (let i in this.campViewTableData) {
      this.customerClientList = this.campViewTableData[i];
      this.customerClientList.Email_Id = this.campViewTableData[i].emailAddress;
      if (this.campViewTableData[i].delivered != null) {
        this.customerClientList.Deliver = this.campViewTableData[i].delivered;
      }
      else {
        this.customerClientList.Deliver = "";
      }
      if (this.campViewTableData[i].totalOpen != null) {
        this.customerClientList.Total_Open = this.campViewTableData[i].totalOpen;
      }
      else {
        this.customerClientList.Total_Open = "";
      }
      if (this.campViewTableData[i].totalClick != null) {
        this.customerClientList.Total_Click = this.campViewTableData[i].totalClick;
      }
      else {
        this.customerClientList.Total_Click = "";
      }
      if (this.campViewTableData[i].subscribed != null) {
        this.customerClientList.Subscribe = this.campViewTableData[i].subscribed;
      }
      else {
        this.customerClientList.Subscribe = "";
      }
      if (this.campViewTableData[i].unsubscribed != null) {
        this.customerClientList.Unsubscribe = this.campViewTableData[i].unsubscribed;
      }
      else {
        this.customerClientList.Unsubscribe = "";
      }
      if (this.campViewTableData[i].blacklisted != null) {
        this.customerClientList.Blacklist = this.campViewTableData[i].blacklisted;
      }
      else {
        this.customerClientList.Blacklist = "";
      }
      if (this.campViewTableData[i].softBounce != null) {
        this.customerClientList.Soft_Bounce = this.campViewTableData[i].softBounce;
      }
      else {
        this.customerClientList.Soft_Bounce = "";
      }
      if (this.campViewTableData[i].hardBounce != null) {
        this.customerClientList.Hard_Bounce = this.campViewTableData[i].hardBounce;
      }
      else {
        this.customerClientList.Hard_Bounce = "";
      }
      if (this.campViewTableData[i].bounceReason != null) {
        if (this.campViewTableData[i].Deliver === '1') {
          this.customerClientList.Reason = this.campViewTableData[i].bounceReason;
        } else {
          if (this.campViewTableData[i].errorMessage != null && this.campViewTableData[i].errorMessage != undefined) {
            this.customerClientList.Reason = this.campViewTableData[i].errorMessage.message;
          } else {
            this.customerClientList.Reason = this.campViewTableData[i].bounceReason;
          }
        }
      }
      else {
        this.customerClientList.Reason = "";
      }
      if (this.campViewTableData[i].tsend != null) {
        this.customerClientList.Send_Date = moment(this.campViewTableData[i].tsend).format('YYYY-MM-DD h:mma');
      }
      else {
        this.customerClientList.Send_Date = "";
      }
      this.downloadCustomerData.push(this.customerClientList);
    }
    if (this.downloadCustomerData.length > 0) {
      this.downloadCSVFile(this.downloadCustomerData, this.campViewData.campaignName);
    } else {
      Swal.fire("This campaign is empty")
    }
  }

  downloadCSVFile(data, filename = 'data') {
    let csvData = this.ConvertToCSV(data, ['Email_Id', 'Deliver', 'Total_Open',
      'Total_Click', 'Subscribe', 'Unsubscribe', 'Blacklist', 'Soft_Bounce',
      'Hard_Bounce', 'Reason', 'Send_Date']);
    //console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

}
