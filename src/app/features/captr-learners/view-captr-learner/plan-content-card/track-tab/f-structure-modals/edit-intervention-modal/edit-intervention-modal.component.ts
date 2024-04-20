import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AppDateAdapter, APP_DATE_FORMATS } from './../../../../../../../framework/components/date-adapter/date-adapter';
import { TrackTabService } from '../../track-tab.service';
import { AddInterventionModalComponent } from '../add-intervention-modal/add-intervention-modal.component';
import * as moment from 'moment';
import { ManageUsersService } from '../../../../../../manage-users/manage-users.service';

@Component({
  selector: 'app-edit-intervention-modal',
  templateUrl: './edit-intervention-modal.component.html',
  styleUrls: ['./edit-intervention-modal.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class EditInterventionModalComponent implements OnInit {

  editInterventionForm: FormGroup;
  outcomeIdValidators = [];
  withdrawalIdValidators = [];
  isOther = false;
  selectedStatus;

  constructor(
    private readonly fb: FormBuilder,
    private readonly trackTabService: TrackTabService,
    private readonly manageUsersService: ManageUsersService,
    public dialogRef: MatDialogRef<EditInterventionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.initForm()
    this.initConditionalFormValidators()
    this.resolveInterventionData()
  }

  resolveInterventionData() {
    this.trackTabService.getSingleInterventionData(this.data.interventionId).subscribe(data => {
      this.editInterventionForm.patchValue(data);
      if (this.isOtherIntervention(data.refInterventionId)) {
        this.isOther = true;
        this.editInterventionForm.get('otherIntName').setValue(data.otherIntName)
      }
      this.editInterventionForm.get('interventionName').setValue((data.otherIntName) ? data.otherIntName : data.interventionName);
      this.editInterventionForm.get('interventionName');
      this.editInterventionForm.get('pathwayName');
      this.editInterventionForm.get('startDate');
      this.editInterventionForm.get('plannedEndDate');
      this.editInterventionForm.get('contactName');
      this.editInterventionForm.get('telephone');
      this.editInterventionForm.get('email');
      this.editInterventionForm.get('description');
    })
  }

  initForm() {
    this.editInterventionForm = this.fb.group({
      activityId: [null],
      actualEndDate: [null],
      id: [null],
      refInterventionId: [null],
      interventionName: [this.data.interventionName],
      otherIntName: [null, [Validators.maxLength(100)]],
      outcomeId: [null, this.outcomeIdValidators],
      pathwayId: [null],
      plannedEndDate: [null],
      serviceUserId: [null],
      startDate: [null],
      statusId: [null],
      pathwayName: [this.data.pathwayName],
      contactName: [null],
      telephone: [null],
      email: [null],
      description: [null],
      withdrawalId: [null, this.outcomeIdValidators],
    });
  }

  initConditionalFormValidators() {
    this.editInterventionForm.get('statusId').valueChanges.subscribe(value => {
      let status = this.data.statusList.filter(data => data.id === value)[0]
      if (status && status.identifier.includes('CMPL')) {
        this.selectedStatus = 'Completed'
        this.editInterventionForm.controls.withdrawalId.setValue(null)
        this.editInterventionForm.controls.withdrawalId.setErrors(null);
        this.editInterventionForm.controls.withdrawalId.markAsPristine();
        this.editInterventionForm.controls.outcomeId.setValidators(this.outcomeIdValidators.concat(Validators.required))
      } else if (status && status.identifier.includes('WDN')) {
        this.selectedStatus = 'Withdrawn'
        this.editInterventionForm.controls.outcomeId.setValue(null)
        this.editInterventionForm.controls.outcomeId.setErrors(null);
        this.editInterventionForm.controls.outcomeId.markAsPristine();
        this.editInterventionForm.controls.withdrawalId.setValidators(this.withdrawalIdValidators.concat(Validators.required));
      } else {
        this.editInterventionForm.controls.outcomeId.setValue(null)
        this.editInterventionForm.controls.outcomeId.setErrors(null);
        this.editInterventionForm.controls.outcomeId.markAsPristine();
      }
    })
  };

  confirmEditIntervention() {
    this.dialogRef.close(this.editInterventionForm.value);
  }

  cancelEditIntervention() {
    this.dialogRef.close();
  }

  calculateMinPlannedEndDate() {
    this.calculateMinActualEndDate();
  }

  calculateMaxStartDate() {
    if (this.editInterventionForm.controls.plannedEndDate.value) {
      return moment(this.editInterventionForm.controls.plannedEndDate.value).subtract(1, 'days');
    } else {
      return null
    }
  }

  calculateMinActualEndDate() {
    if (this.editInterventionForm.controls.startDate.value) {
      return moment(this.editInterventionForm.controls.startDate.value).add(1, 'days');
    } else {
      return null
    }
  }

  isOtherIntervention(id) {
   let obj = this.data.interventionList.filter(data => data.id === id)[0];
   if(obj.identifier.includes('OTR')) {
    this.isOther = true;
    return true;
   }
   else {
    this.isOther = false;
    this.editInterventionForm.get('otherIntName').reset();
    this.editInterventionForm.get('otherIntName').clearValidators();
    this.editInterventionForm.get('otherIntName').updateValueAndValidity();
   return false;
   }
  }
}
