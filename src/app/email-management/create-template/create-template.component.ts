import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { NgForm, FormGroup } from '@angular/forms';
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import Swal from 'sweetalert2';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';
import { Router } from '@angular/router';

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
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {

  btnName = "Save";
  editMode = false;
  pageName: String = "Create"

  userInfo: any = {
    templateName: "",
    emailDescription: "",
    styleTemplate: "",
    typeOfTemplate: "Blob"
  }
  campaignRouting: any;
  campProcessData: any;
  campProcessRouting: any = [];
  submitFlg = false;

  constructor(private router: Router, private emailManaementService: EmailManaementService, private previewService: PreviewService) {
    if (this.previewService.getProcessList != null && this.previewService.getProcessList != undefined) {
      this.userInfo = this.previewService.getProcessList;
      this.btnName = "Update";
      this.editMode = true;
      this.pageName = "Edit";
    }
    if (this.previewService.getProcessList != null && this.previewService.getProcessList != undefined) {
      if (sessionStorage.getItem("TempClone") == "TempClone") {
        this.previewService.getProcessList.emailTemplateSkey = "";
        this.userInfo.templateName = this.previewService.getProcessList.templateName + "_" + "Copy1";
        this.userInfo.emailDescription = this.previewService.getProcessList.emailDescription;
        this.userInfo.styleTemplate = this.previewService.getProcessList.styleTemplate;
        this.userInfo.typeOfTemplate = this.previewService.getProcessList.typeOfTemplate;
        this.btnName = "Save";
        this.editMode = false;
        this.pageName = "Create";
      }
    }
    // Campdshboared Routing from create camp +
    if (this.previewService.campaignRouting != null && this.previewService.campaignRouting != undefined && this.previewService.selectedCampaignIdListRouting != null && this.previewService.selectedroutingList != null) {
      this.campaignRouting = this.previewService.campaignRouting;
      this.campProcessData = this.previewService.selectedCampaignIdListRouting;
      this.campProcessRouting = this.previewService.selectedroutingList;
    }

  }

  ngOnInit(): void {

    $(document).ready(function () {
      $("#show").click(function () {
        $("#tr").toggle(800);
      });
    });
    $("#tr").hide()
  }

  Cancel() {
    if (this.campaignRouting == "campDashboard") {
      this.previewService.selectedCampaignIdListRouting = this.campProcessData;
      this.previewService.selectedroutingList = this.campProcessRouting;
      this.router.navigate(['/create-campaign']);
    } else {
      this.router.navigate(['/template']);
    }
    this.userInfo.templateName = "";
    this.userInfo.emailDescription = "";
    this.userInfo.styleTemplate = "";

  }

  saveUser(createTemplate: NgForm) {
    this.userInfo.customerId = sessionStorage.getItem('customerId');
    this.createEmailTeamplate(this.userInfo);
  }

  createEmailTeamplate(userInfo) {
    var flg = 0;
    let resp = this.emailManaementService.checkDuplicateTemplate(this.userInfo.templateName, sessionStorage.getItem('customerId'));
    resp.subscribe(data => {
      if (data == '1' || data == 1) {
        flg = 0;
        this.checkDuplicateTemplate();
        if (this.editMode == true) {
          flg = 1;
        }
      } else {
        flg = 1;
      }
      if (flg == 1) {
        this.submitFlg = true;
        userInfo.typeOfTemplate = "Blob";
        let resp = this.emailManaementService.createEmailTeamplate(userInfo);
        resp.subscribe(data => {
          if (data == 1 || data == '1') {
            this.submitFlg = false;
            if (this.editMode == true) {
              Toast.fire({
                icon: 'success',
                title: 'Template updated successfully'
              })
            } else {
              Toast.fire({
                icon: 'success',
                title: 'Template created successfully'
              })
            }
            this.userInfo.templateName = "";
            this.userInfo.emailDescription = "";
            this.userInfo.styleTemplate = "";
            this.userInfo.typeOfTemplate = "Blob";
            this.btnName = "Save";
            this.editMode = false;
            if (this.campaignRouting == "campDashboard") {
              this.previewService.selectedCampaignIdListRouting = this.campProcessData;
              this.previewService.selectedroutingList = this.campProcessRouting;
              this.router.navigate(['/create-campaign']);
            } else {
              this.router.navigate(['/template']);
            }

          }
        });
      }
    });
  }

  checkDuplicateTemplate() {
    let resp = this.emailManaementService.checkDuplicateTemplate(this.userInfo.templateName, sessionStorage.getItem('customerId'));
    resp.subscribe(data => {
      if (data == '1' || data == 1) {
        Swal.fire("Template name already available!");
        this.userInfo.templateName = "";
      }
    });
  }
}
