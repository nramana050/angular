import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";
import { EmailManaementService } from '../email-management-service/email-manaement.service';
import Swal from 'sweetalert2';
import { PreviewService } from 'src/app/GobalAPIService/global-service-service/PreviewService';

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
  selector: 'app-create-process',
  templateUrl: './create-process.component.html',
  styleUrls: ['./create-process.component.css']
}) 
export class CreateProcessComponent implements OnInit {

  changeFlg = false;
  submitFlg=false;


  btnName: string = "Save";
  pageName: String = "Create"

  processInfo: any = {
    processName: "",
    processDescription: "",
    customerId: "",
  };
  processData: any;
  campaignRouting: any;
  campProcessData: any;
  campProcessRouting: any = [];

  constructor(private router: Router, private location: Location, private emailservice: EmailManaementService, private previewService: PreviewService) {
    this.changeFlg = false;

    if (this.previewService.selecteProcessIdList != "" && this.previewService.selecteProcessIdList != null && this.previewService.selecteProcessIdList != undefined) {
      this.processData = this.previewService.selecteProcessIdList
      this.btnName = "Update";
      this.pageName = "Edit"
      this.changeFlg = true;
      this.processInfo.processName = this.processData.processName;
      this.processInfo.processDescription = this.processData.processDescription;

    }
    if (this.previewService.campaignRouting != null && this.previewService.campaignRouting != undefined && this.previewService.selectedCampaignIdListRouting != null) {
      this.campaignRouting = this.previewService.campaignRouting;
      this.campProcessData = this.previewService.selectedCampaignIdListRouting;
      this.campProcessRouting = this.previewService.selectedroutingList;
    }
  }

  ngOnInit(): void {
  }

  redirectToprocess() {

    if (this.campaignRouting == "campDashboard") {
      this.previewService.selectedCampaignIdListRouting = this.campProcessData;
      this.previewService.selectedroutingList = this.campProcessRouting;
      this.router.navigate(['/create-campaign']);
    } else {
      this.router.navigate(['/process-management']);
    }


  }

  // form submit 
  CreateProcess(createProcess: NgForm) {
    this.submitFlg=true;
    this.changeFlg = false;
    if (this.processData != null) {
      this.processInfo.processSkey = this.processData.processSkey;
      this.processInfo.processId = this.processData.processId;
      this.processInfo.createdDate = this.processData.createdDate;
      this.processInfo.status = this.processData.status;
    }

    let resp = this.emailservice.saveCreateProcess(this.processInfo);
    resp.subscribe(data => {
      this.submitFlg=false;
      this.processInfo.processName = "";
      this.processInfo.processDescription = "";
      //createProcess.resetForm();
      if (data == 1 || data == '1' && data.modifiedDate == null) {

        if (this.pageName.includes("Edit")) {
          Toast.fire({
            icon: 'success',
            title: 'Process updated successfully.'
          })
        } else {
          Toast.fire({
            icon: 'success',
            title: 'Process created successfully.'
          })
        }

      }
      if (this.campaignRouting == "campDashboard") {
        this.previewService.selectedCampaignIdListRouting = this.campProcessData;
        this.previewService.selectedroutingList = this.campProcessRouting;
        this.router.navigate(['/create-campaign']);
      } else {
        this.router.navigate(['/process-management']);
      }

    });
  }

  getUniqueProcessName(processName) {
    let resp = this.emailservice.getUniqueProcessName(processName);
    resp.subscribe(data => {
      if (data != null && data != '') {
        this.processInfo.processName = "";
        Swal.fire("Process name already exists!");

      }
    });
  }


}
