import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  ConfigurationData: any;
  ConfigShowData: any = {};
  sendMailTestObj: any = {};
  SendTestMailList: any = [];
  ListData: any;
  senderData: any;
  templateData: any;
  backButtonData: any;
  userInfo = {
    testMail: "",
    campaignSkey: "",
  }
  customerId: string;
  updateSendMailObj: any = {};
  invalidInput: boolean;
  invalidIdFlg = false;
  invalidId = "";

  constructor(private router: Router, private location: Location, private previewService: PreviewService, private emailService: EmailManaementService) {
    this.backButtonData = this.previewService.selecteCampaignIdList;
    if (this.backButtonData == null || this.backButtonData == undefined || this.backButtonData == "") {
      this.router.navigate(['/campaign-management']);
    }
    this.getAllList();
    this.getAllSenderList();
    this.getAllTemplateList();
  }


  ngOnInit(): void {
    this.customerId = sessionStorage.getItem("customerId");
    if (this.customerId == null || this.customerId == undefined || this.customerId == "") {
      this.router.navigate(['/campaign-management']);
    }

  }

  setConfiguration() {

    this.ConfigurationData = this.previewService.selecteCampaignIdList;
    // set List anme
    let Listname = "";
    for (let i in this.ConfigurationData.campaignListMap) {
      for (let r in this.ListData) {
        if (this.ListData[r].listId == this.ConfigurationData.campaignListMap[i].listId) {
          Listname = Listname + "," + this.ListData[r].listName;
        }
      }
    }
    var myListName = Listname;
    if (myListName.charAt(0) === ',') {
      myListName = myListName.slice(1);
      this.ConfigShowData.configList = myListName;
    }
    // set subject

    this.ConfigShowData.configSubject = this.ConfigurationData.campaign.subject;

    //
    this.ConfigShowData.scheduleCampaign = this.ConfigurationData.campaign.scheduleCampaign;
    //email template

    for (let r in this.templateData) {
      if (this.templateData[r].emailTemplateSkey == this.ConfigurationData.campaign.emailTemplateSkey) {
        this.ConfigShowData.templateName = this.templateData[r].templateName;
      }
    }
    // sender
    for (let r in this.senderData) {
      if (this.senderData[r].senderId == this.ConfigurationData.campaign.senderId) {
        this.ConfigShowData.senderEmail = this.senderData[r].emailAddress;
      }
    }
  }


  getAllTemplateList() {
    let resp = this.emailService.getAllTemplateList();
    resp.subscribe(data => {
      if (data != 0) {
        this.templateData = data;
      }
    });
  }

  getAllList() {
    let resp = this.emailService.getAllList();
    resp.subscribe(data => {
      if (data != 0) {
        this.ListData = data;
        this.getAllSenderList();

      }
    })
  }

  getAllSenderList() {
    let resp = this.emailService.getAllSenderList();
    resp.subscribe(data => {
      if (data != 0) {

        if (this.previewService.selecteCampaignIdList != null && this.previewService.selecteCampaignIdList != undefined) {
          this.senderData = data;
          this.setConfiguration();
        }
      }
    });
  }

  redirectToCampignmanagement() {
    this.router.navigate(['/campaign-management']);
  }

  // back button set data to service.
  redirectToCreateCampign() {
    this.previewService.selecteCampaignIdList = this.backButtonData;
    this.previewService.selectedCampaignIdListRouting=null;
    this.previewService.selectedroutingList=null;
    sessionStorage.setItem("Clone", null);
    this.router.navigate(['/create-campaign']);
  }




  sendCampaign() {

    this.updateSendMailObj = {};
    if (this.ConfigShowData.scheduleCampaign == "scheduleLater") {
      this.updateSendMailObj.campaignSkey = this.ConfigurationData.campaign.campaignSkey;
      this.updateSendMailObj.campaignStatus = "Sheduled";
    } else {
      this.updateSendMailObj.campaignStatus = "Send";
      this.updateSendMailObj.campaignSkey = this.ConfigurationData.campaign.campaignSkey;

    }
    let msg = '';
    let BtnMsg = '';

    msg = "Do you want to send this campaign?";
    BtnMsg = "Send";

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

        let resp = this.emailService.sendMailCampaign(this.updateSendMailObj);
        resp.subscribe(data => {
          if (data == 0 || data == 1) {
            this.router.navigate(['/dashboard']);
            Swal.fire(
              'Send',
              'Your campaign has been sent successfully',
              'success'
            )
          }
        });
      }

    })
  }

  sendTestMail(testMailForm: NgForm) {
    this.invalidInput = false;
    var filesArray;

    if (this.userInfo.testMail) {
      if (this.userInfo.testMail.includes("@")) {
        this.userInfo.testMail = this.userInfo.testMail;
        if (this.userInfo.testMail.split('@').length - 1 <= 3) {
          if (this.userInfo.testMail.includes(",")) {
            filesArray = this.userInfo.testMail.split(',');
          } else if (this.userInfo.testMail.includes(" ")) {
            filesArray = this.userInfo.testMail.split(' ');
          } else {
            filesArray = this.userInfo.testMail.split(' ');
          }

          if (this.userInfo.testMail.includes("|") || this.userInfo.testMail.includes("-") || this.userInfo.testMail.includes(":")) {
            this.invalidInput = true;
          }

          if (this.invalidInput == false) {
            this.sendMailTestObj = {};
            this.SendTestMailList = [];
            let flg = 0;
            this.invalidIdFlg = false;
            this.invalidId = "";
            for (var i in filesArray) {
              var mailLIst = filesArray[i].split("@");

              if (filesArray[i].includes("@")) {
                this.sendMailTestObj.testMail = JSON.parse(JSON.stringify(filesArray[i]));
                this.sendMailTestObj.campaignSkey = JSON.parse(JSON.stringify(this.ConfigurationData.campaign.campaignSkey));
                this.sendMailTestObj.customerId = this.customerId;
                this.sendMailTestObj.subject = this.ConfigShowData.configSubject;
                this.sendMailTestObj.sendFrom = this.ConfigShowData.senderEmail;
                this.SendTestMailList.push(JSON.parse(JSON.stringify(this.sendMailTestObj)));
              } else {
                this.invalidId = JSON.stringify(filesArray[i]);
                this.invalidIdFlg = true;
                flg = 1;
              }
            }
            if (flg == 0) {
              let resp = this.emailService.sendTestMail(this.SendTestMailList);
              resp.subscribe(data => {
                if (data == 0 || data == 1) {
                  this.userInfo.testMail = "";
                  testMailForm.resetForm();
                  Swal.fire(
                    'Send',
                    'Your test mail has been sent successfully',
                    'success'
                  )
                }
              });
            } else {
              // error active
            }

          } else {
            Swal.fire("Please enter email Id seperated by ',' ' '")
          }
        } else {
          Swal.fire("You can't test more than 3 email Id")
        }
      } else {

        Swal.fire("Please enter valid email Id")
      }
    } else {
      Swal.fire("Please enter email Id")

    }

  }


}
