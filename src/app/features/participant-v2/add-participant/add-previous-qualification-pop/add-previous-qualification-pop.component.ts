import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AddProviderComponent } from 'src/app/features/admin/provider-setup/add-provider/add-provider.component';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ParticipantV2Service } from '../../participant-v2.service';

@Component({
  selector: 'app-add-previous-qualification-pop',
  templateUrl: './add-previous-qualification-pop.component.html',
  styleUrls: ['./add-previous-qualification-pop.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddPreviousQualificationPopComponent implements OnInit {
  autoPop = true;
  refAnswer;
  maxStartDate = new Date(new Date().setFullYear(new Date().getFullYear()));
  minEndDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  isNew = true;
  userId;
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
    this.refAnswer= Utility.filterMapByKey("Level");
    this.initializeForm();

  }
  getPreviousQualification(data) {
    this.previousQualifications.patchValue(data);
    if(data.id!=null)
    {
      this.previousQualifications.get('qualification').disable();
    } 
  }

  initializeForm()
  {
    this.previousQualifications = this.fb.group({
      qualification: [null, [Validators.required, Validators.maxLength(100)]],
      levelId: [null, [Validators.required]],
      startDate: ['', [Validators.required]],
      achievedDate: ['', [Validators.required]],
    });
    this.previousQualifications.get('startDate').valueChanges
      .subscribe(date => {
        if (date) {
          this.setDateConstraints(new Date(date));
        }
      });
  }
  ngOnInit(): void {
   
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.userId = +params['id'];

        
      }

  })
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
    let data = this.refAnswer.find(data => data.id == payload.levelId)
    payload.levelName = data.description
    payload.startDate = Utility.transformDateToString(payload.startDate);
    payload.achievedDate = Utility.transformDateToString(payload.achievedDate);
    if(this.userId !==undefined)
    { 
       payload.extdUserId=this.userId
      this.participantV2Service.oneditAddOrEditPreviousQualificayion(payload).subscribe(data=>{
        this.snackBarService.success('Previous qualification added successfully');
        this.dailogRef.close(data);
      })
    }
    else{
      this.snackBarService.success('Previous qualification added successfully');
      this.dailogRef.close(payload);
    }
    
  }
  
updatePreviousQualification()
{
    const payload = this.previousQualifications.getRawValue();
    let data = this.refAnswer.find(data => data.id == payload.levelId)
    payload.levelName = data.description
    payload.startDate = Utility.transformDateToString(payload.startDate);
    payload.achievedDate = Utility.transformDateToString(payload.achievedDate);
    
    if(this.userId !==undefined)
    { 
       payload.extdUserId=this.userId
       payload.id=this.data.id;
       this.participantV2Service.oneditAddOrEditPreviousQualificayion(payload).subscribe(data=>{
       this.snackBarService.success('Previous qualification updated successfully');
       this.dailogRef.close(data);
      })
    }
    else{
      this.snackBarService.success('Previous qualification updated successfully');
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
