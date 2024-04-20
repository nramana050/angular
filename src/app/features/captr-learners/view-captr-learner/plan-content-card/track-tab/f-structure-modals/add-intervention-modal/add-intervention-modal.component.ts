import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../../../framework/components/date-adapter/date-adapter';
import * as moment from 'moment';

@Component({
  selector: 'app-add-intervention-modal',
  templateUrl: './add-intervention-modal.component.html',
  styleUrls: ['./add-intervention-modal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddInterventionModalComponent implements OnInit {

  addInterventionForm: FormGroup;
  currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  telephoneCodePattern = /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?#(\d{4}|\d{3}))?$/;
  emailPattern = /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  namePattern = /^[a-zA-Z-'\s]+$/;
  isOther: boolean;

  constructor(
    private readonly fb: FormBuilder,
    public dialogRef: MatDialogRef<AddInterventionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.initForm();
    this.addInterventionForm.get('interventionName').valueChanges.subscribe(value =>{
      this.addInterventionForm.get('otherInterventionName').reset();
      this.addInterventionForm.get('otherInterventionName').setErrors(null);
    })
  }

  isOtherIntervention(value) {
   if(value.identifier.includes('OTR')) {
    this.isOther = true;
    return true;
   }
   else {
    this.isOther = false;
    this.addInterventionForm.get('otherInterventionName').reset();
    this.addInterventionForm.get('otherInterventionName').clearValidators();
    this.addInterventionForm.get('otherInterventionName').updateValueAndValidity();
    return false;
   }
  }

  initForm() {
    this.addInterventionForm = this.fb.group({
      interventionName: [null, [Validators.required]],
      otherInterventionName: [null, [Validators.maxLength(100)]],
      pathway: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      plannedEndDate: [null, [Validators.required]],
      contactName: [null, [Validators.required, Validators.maxLength(50), Validators.pattern(this.namePattern)]],
      telephone: [null, [Validators.required, Validators.maxLength(18), Validators.pattern(this.telephoneCodePattern)]],
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      interventionDescription: [null, [Validators.required, Validators.maxLength(500)]],
    });
  }

  confirmAddIntervention() {
    this.dialogRef.close(this.addInterventionForm.value);
  }

  cancelAddIntervention() {
    this.dialogRef.close();
  }

  calculateMaxStartDate() {
    if (this.addInterventionForm.controls.plannedEndDate.value) {
      return moment(this.addInterventionForm.controls.plannedEndDate.value).subtract(1, 'days');
    } else {
      return null
    }
  }

  calculateMinPlannedEndDate() {
    if (this.addInterventionForm.controls.startDate.value) {
      return moment(this.addInterventionForm.controls.startDate.value).add(1, 'days');
    } else {
      return null
    }
  }

}
