import { Component, OnInit } from '@angular/core';
import { ReportsService } from './reports.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';

const participant_info = 'Participant Info';
const Interventions = 'Interventions';
const Appointments = 'Appointments';
const Engagements = 'Engagements';
const Wellbeing_Measures_Assessment = 'Wellbeing Measures Assessment';
const Service_User_Feedback_Assessment = "Service User Feedback Assessment";
const Ndelius_VC_Information = "Ndelius & VC Info";
const Action_Plan = 'Action Plan';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  reportsExtractsForm: FormGroup;
  staticExtractTypes = [
    { id: 1, reportName: participant_info, reportDescription: participant_info, fileName: participant_info },
    { id: 2, reportName: Interventions, reportDescription: Interventions, fileName: Interventions },
    { id: 3, reportName: Appointments, reportDescription: Engagements, fileName: Engagements },
    { id: 4, reportName: Wellbeing_Measures_Assessment, reportDescription: Wellbeing_Measures_Assessment, fileName: Wellbeing_Measures_Assessment },
    { id: 5, reportName: Service_User_Feedback_Assessment, reportDescription: Service_User_Feedback_Assessment, fileName: Service_User_Feedback_Assessment },
    { id: 6, reportName: Ndelius_VC_Information, reportDescription: Ndelius_VC_Information, fileName: Ndelius_VC_Information },
    { id: 7, reportName: Action_Plan, reportDescription: Action_Plan, fileName: Action_Plan },
    
  ];
  constructor(
    private readonly reportService: ReportsService,
    private readonly snackBarService: SnackBarService,
    private readonly fb: FormBuilder) {
  }

  ngOnInit() {
    this.reportsExtractsForm = this.fb.group({
      extractType: [null, Validators.required],
    });

  }

  onSubmit(reportsExtractsForm) {
    const { extractRsp, fileName }: { extractRsp: any; fileName: string; }
      = this.extractReportsByType(reportsExtractsForm);

    extractRsp.subscribe(
      response => {
        if (response.status === 204) {
          this.snackBarService.error("Report not found");
        } else {
          const binaryData = [];
          binaryData.push(response.body);
          const responseFileName: string = this.getResponseFileName(response, fileName);
          const extractLink = document.createElement('a');
          extractLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: response.headers.get('Content-Type') }));
          extractLink.setAttribute('download', responseFileName);
          document.body.appendChild(extractLink);
          extractLink.click();
          extractLink.remove();
        }
      },
      error => {
        this.snackBarService.error(error.error.applicationMessage);
      }
    );
  }

  private extractReportsByType(reportsExtractsForm: any) {
    let extractRsp: any;
    const type = reportsExtractsForm.get('extractType').value;
    const fileName = this.staticExtractTypes.filter(et => et.reportName === type)[0].fileName;
    if (type === 'Participant Info') {
      extractRsp = this.reportService.extractUsersLLIFdata(fileName);
    } else if (type === 'Wellbeing Measures Assessment') {
      extractRsp = this.reportService.healthAndWellBeingReport(fileName, type.toLowerCase());
    } else if (type === 'Service User Feedback Assessment') {
      extractRsp = this.reportService.healthAndWellBeingReport(fileName, type.toLowerCase());
    } else if (type === 'Ndelius & VC Info'){
      extractRsp = this.reportService.extractNdeliusAndVCData(fileName);
    }
    else {
      extractRsp = this.reportService.extractPlanLLIFdata(fileName, type.toLowerCase());
    }
    return { extractRsp, fileName };
  }

  getResponseFileName(response: HttpResponse<Blob>, defaultName: string) {
    let fileName: string;
    try {
      const contentDisposition: string = response.headers.get('Content-Disposition');
      const pattern = /(?:filename="?)(.+)(?:"?)/
      fileName = pattern.exec(contentDisposition)[1];
    }
    catch (err) {
      fileName = defaultName + '.csv';
    }
    return fileName
  }

}
