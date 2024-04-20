import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AddProviderComponent } from 'src/app/features/admin/provider-setup/add-provider/add-provider.component';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ParticipantV2Service } from '../../participant-v2.service';

@Component({
  selector: 'app-to-wards-qualifican-pop-up',
  templateUrl: './to-wards-qualifican-pop-up.component.html',
  styleUrls: ['./to-wards-qualifican-pop-up.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ToWardsQualificanPopUpComponent implements OnInit {

  autoPop = true;
  qualificationTowards;
  maxStartDate = new Date(new Date().setFullYear(new Date().getFullYear()));
  minEndDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  isNew = true;
 
  previousQualification: any
  previousQualifications: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly dailogRef: MatDialogRef<AddProviderComponent>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly participantV2Service: ParticipantV2Service,
  ) { 
    this.qualificationTowards= Utility.filterMapByKey("Qualification_Towards");
    this.initializeForm();

  }
  getPreviousQualification(data) {
    this.previousQualifications.patchValue(data);
    if(data.id!=null)
    {
      this.previousQualifications.get('qualificationTowardsId').disable();
    }
  }

  initializeForm()
  {
    this.previousQualifications = this.fb.group({
      qualificationTowardsId: [null, [Validators.required]],
      startDate: ['', [Validators.required]],
      achievedDate: [''],
    });
    this.previousQualifications.get('startDate').valueChanges
      .subscribe(date => {
        if (date) {
          this.setDateConstraints(new Date(date));
        }
      });
  }
  userId
  ngOnInit(): void {
   
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.userId = +params['id'];
      }})

    if(this.data!=null)
    {
      this.isNew = false;
      this.getPreviousQualification(this.data)
    }
  }
  onSubmit() {
    this.isNew ? this.createPreviousQualification() : this.updatePreviousQualification();
  }
  dialogClose(): void {
    this.dailogRef.close();
  }

  createPreviousQualification ()
  {
    const payload = this.previousQualifications.getRawValue();
    let data = this.qualificationTowards.find(data => data.id == payload.qualificationTowardsId)
    payload.qualificationTowardsName = data.description
    payload.startDate = Utility.transformDateToString(payload.startDate);
    if (payload.achievedDate === "") {
      payload.achievedDate = null;
    }
    else{
      payload.achievedDate = Utility.transformDateToString(payload.achievedDate);
    }
    if(this.userId !==undefined)
    { 
       payload.extdUserId=this.userId
      this.participantV2Service.oneditAddOrEditToWordsQualificayion(payload).subscribe(data=>{
        this.snackBarService.success('Current qualification added successfully');
        this.dailogRef.close(data);
      })
    }
    else{
      this.snackBarService.success('Current qualification added successfully');
      this.dailogRef.close(payload);
    }
  }
updatePreviousQualification()
{
    const payload = this.previousQualifications.getRawValue();
    let data = this.qualificationTowards.find(data => data.id == payload.qualificationTowardsId)
    payload.qualificationTowardsName = data.description
    payload.startDate = Utility.transformDateToString(payload.startDate);
    if (payload.achievedDate === "") {
      payload.achievedDate = null;
    }
    else{
      payload.achievedDate = Utility.transformDateToString(payload.achievedDate);
    }
  if(this.userId !==undefined)
    { 
        payload.extdUserId=this.userId
        payload.id=this.data.id;
        this.participantV2Service.oneditAddOrEditToWordsQualificayion(payload).subscribe(data=>{
        this.snackBarService.success('Towards qualification updated successfully');
        this.dailogRef.close(data);
      })
    }
    else{
      this.snackBarService.success('Towards qualification added successfully');
      this.dailogRef.close(payload);
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
