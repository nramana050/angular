import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrisonJobsService } from '../prison-jobs.service';
import { Location } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../framework/components/date-adapter/date-adapter';
import { SnackBarService } from '../../../../framework/service/snack-bar.service';
import { Utility } from '../../../../framework/utils/utility';


@Component({
  selector: 'app-edit-prison-jobs',
  templateUrl: './edit-prison-jobs.component.html',
  styleUrls: ['./edit-prison-jobs.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class EditPrisonJobsComponent implements OnInit {

  prisonJobForm: FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  minStartDate: Date;
  minEndDate: Date;
  isEdit = false;
  jobId;
  isAfterPosting = false;
  private readonly BASE_PRISON_URL = './job-advert/prison-jobs';

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly prisonJobsService: PrisonJobsService,
    private readonly location: Location
  ) {
    this.minStartDate = new Date();
    this.minEndDate = new Date();
    this.minEndDate.setDate(this.minStartDate.getDate() + 1);
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('jobId')) {
        this.jobId = params.jobId;
      }
    });
  }

  ngOnInit() {
    if (this.jobId) {
      this.isEdit = true;
      this.resolveJobData();
    }
    this.initForm();
  }

  resolveJobData() {
    this.prisonJobsService.getPrisonJob(this.jobId).subscribe((data: any) => {
      this.prisonJobForm.patchValue(data);
      if(data.postingDate) {
        this.prisonJobForm.get('postingDate').setValue(new Date(data.postingDate));
        this.setPostingDateConstraints(new Date(data.postingDate));
      }
      if(data.closingDate) {
        this.prisonJobForm.get('closingDate').setValue(new Date(data.closingDate));
      }
    }, error => {
      this.location.back();
      this.snackBarService.error(error.error.applicationMessage);
    });
  }


  initForm() {
    this.prisonJobForm = this.fb.group({
      id: [null],
      jobTitle: [null, [Validators.required, Validators.maxLength(100)]],
      location: [null, [Validators.required, Validators.maxLength(50)]],
      pay: [null, [Validators.required, Validators.maxLength(50)]],
      jobDescription: [null, [Validators.required, Validators.maxLength(1000)]],
      postingDate: [null, [Validators.required]],
      closingDate: [null, [Validators.required]],
    });
    this.prisonJobForm.get('postingDate').valueChanges
    .subscribe(date => {
    if (date) {
      this.valueChangesPostingDateConstraints(new Date(date));
    }
});
  }
  
  onSubmit() {
    if (this.prisonJobForm.valid) {
      const payload = this.prisonJobForm.getRawValue();
      payload.postingDate = Utility.transformDateToString(payload.postingDate);
      payload.closingDate = Utility.transformDateToString(payload.closingDate);
      if(this.isEdit){
        this.prisonJobsService.updatePrisonJob(payload).subscribe(data => {
          this.snackBarService.success('Prison job has been updated successfully!');
          this.router.navigate([this.BASE_PRISON_URL]);
        },
          error => {
            this.snackBarService.error(error.error.applicationMessage);
          }
        );
      }else{
        this.prisonJobsService.savePrisonJob(payload).subscribe(data => {
          this.snackBarService.success('Prison job has been added successfully!');
          this.router.navigate([this.BASE_PRISON_URL]);
        },
          error => {
            this.snackBarService.error(error.error.applicationMessage);
          }
        );
      }
    }
  }

  valueChangesPostingDateConstraints(date?: Date){
    const today =  new Date();
    if (!this.isEdit) {
      this.minEndDate = new Date(date);
      this.minEndDate.setDate(date.getDate() + 1);
    } else {
      this.minStartDate.setTime(today.getTime());
      date < today ? this.minEndDate = new Date(today):
      this.minEndDate = new Date(date);
      this.minEndDate.setDate( this.minEndDate.getDate() + 1);
      this.prisonJobForm.get('closingDate').markAsTouched();
    }
    const postingDate = Utility.transformDateToString(this.prisonJobForm.get('postingDate').value);
    const closingDate = Utility.transformDateToString(this.prisonJobForm.get('closingDate').value);
    this.isAfterPosting = new Date(postingDate) >= new Date(closingDate);
  }

  setPostingDateConstraints(date?: Date) {
    const today =  new Date();
    this.minStartDate < today ? this.minStartDate = new Date(today):
    this.minStartDate = new Date(date);
    this.minStartDate > today ? this.minStartDate.setTime(today.getTime()): 
    this.minStartDate.setTime(date.getTime());
  }

  onExitClicked() {
    this.router.navigate([this.BASE_PRISON_URL]);
  }

}
