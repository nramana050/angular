import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AddProviderComponent } from 'src/app/features/admin/provider-setup/add-provider/add-provider.component';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ParticipantV4Service } from '../../participant-v4.service';

@Component({
  selector: 'app-qualification-pop-up',
  templateUrl: './qualification-pop-up.component.html',
  styleUrls: ['./qualification-pop-up.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class QualificationPopUpComponent implements OnInit {
  autoPop = true;
  maxStartDate = new Date(new Date().setFullYear(new Date().getFullYear()));
  minEndDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  isNew = true;
  userId;
  qualification: any
  qualificationDetails: FormGroup;
  isQualifications: boolean;
  allData:any;
  qualificationListArray = [];
dataEmitter = new EventEmitter<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly dailogRef: MatDialogRef<AddProviderComponent>,
    private readonly route: ActivatedRoute,
    private readonly participantV4Service: ParticipantV4Service,
  ) { 
    this.initializeForm();
    this.participantV4Service.getRefDataAllDetails().subscribe(data => {
      this.allData = data;
    })

  }

getlearnerQualification(data) {
  this.qualificationDetails.patchValue(data);
  if(data.id!=null)
  {
    this.qualificationDetails.get('qualification').disable();
  } 
}

  initializeForm()
  {
    this.qualificationDetails = this.fb.group({
      nvqsQualification: [null, [Validators.required]],
      siteOfQualificationCompletion: [null, [Validators.required]],
      fullyParticiallyStatus: [null, [Validators.required]],
      achieveDate: ['', [Validators.required]],
    });
  
  }
  ngOnInit(): void {
   
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.userId = +params['id'];       
      }

  })
    if(this.data.popupObj!=null)
    {
      this.isNew = false;
      this.getlearnerQualification(this.data.popupObj)
    }
  }
  onSubmit() {
    this.isNew ? this.createQualification() : this.updateQualification();
  }
  dialogClose(): void {
     this.dailogRef.close();
  }

  createQualification ()
  {
    const payload = this.qualificationDetails.getRawValue();
    let nvqsdata = this.allData?.refDataMap?.NVQS_Achieved.find(data => data.id == payload.nvqsQualification)
    payload.nvqsQualificationName = nvqsdata.description
    let sitedata = this.allData?.refDataMap?.Site_Qualification_Completed.find(data => data.id == payload.siteOfQualificationCompletion)
    payload.siteOfQualificationCompletionName = sitedata.description
    let data = this.allData?.refDataMap?.Fully_Partially_Completed.find(data => data.id == payload.fullyParticiallyStatus)
    payload.fullyParticiallyStatusName = data.description
    payload.achievedDate = Utility.transformDateToString(payload.achievedDate);
    const isqualificationNVQSPresent = this.data.filter(item => item.nvqsQualification === payload.nvqsQualification);      
     const date =isqualificationNVQSPresent.filter(qualifications =>
     Utility.transformDateToString(qualifications.achieveDate) === Utility.transformDateToString(payload.achieveDate))   
     if(isqualificationNVQSPresent.length >= 1 &&date.length>=1){
           this.snackBarService.error("This qualification has already been recorded on the system. Please review and update qualification information")
      }else{
        this.dailogRef.close(payload);
        this.snackBarService.success('Qualification added successfully');
      }
    
  }
  
updateQualification()
{
  const payload = this.qualificationDetails.getRawValue();
  let nvqsdata = this.allData?.refDataMap?.NVQS_Achieved.find(data => data.id == payload.nvqsQualification)
  payload.nvqsQualificationName = nvqsdata.description
  let sitedata = this.allData?.refDataMap?.Site_Qualification_Completed.find(data => data.id == payload.siteOfQualificationCompletion)
  payload.siteOfQualificationCompletionName = sitedata.description
  let data = this.allData?.refDataMap?.Fully_Partially_Completed.find(data => data.id == payload.fullyParticiallyStatus)
  payload.fullyParticiallyStatusName = data.description
  payload.achievedDate = Utility.transformDateToString(payload.achievedDate); 
  
  
  const isqualificationNVQSPresent = this.data.listdata.filter(qualification =>
    qualification.nvqsQualification === payload.nvqsQualification)
    const date =isqualificationNVQSPresent.filter(qualification =>
      Utility.transformDateToString(qualification.achieveDate) === Utility.transformDateToString(payload.achieveDate))
      const fullyParticiallyStatus =isqualificationNVQSPresent.filter(qualification =>
        qualification.fullyParticiallyStatus=== payload.fullyParticiallyStatus)
        const siteOfQualificationCompletion =isqualificationNVQSPresent.filter(qualification =>
          qualification.siteOfQualificationCompletion=== payload.siteOfQualificationCompletion);
  if(isqualificationNVQSPresent.length >= 1&&date.length>=1 && fullyParticiallyStatus.length>=1
     && siteOfQualificationCompletion.length>=1 ){
        this.snackBarService.error("This qualification has already been recorded on the system. Please review and update qualification information")
    
  }else{
    this.dailogRef.close(payload);
    this.snackBarService.success('Qualification updated successfully');
  }

}

setDateConstraints(date?: Date) {
  if (this.isNew) {
    this.minEndDate = new Date(date);
    this.minEndDate.setDate(date.getDate());
  } else {
      this.minEndDate = new Date(date);
     this.minEndDate.setDate(this.minEndDate.getDate() );
   
  }
}
 

}
