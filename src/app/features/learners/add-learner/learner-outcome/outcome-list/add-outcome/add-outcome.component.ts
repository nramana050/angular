import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProgrammeDeliveryService } from 'src/app/features/programme-management/programme-delivery/programme-delivery.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { LearnersOutcomeService } from '../../learner-outcome-service';
import { IEmployerNameList } from './IEmployerNameList';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';


@Component({
  selector: 'app-add-outcome',
  templateUrl: './add-outcome.component.html',
  styleUrls: ['./add-outcome.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check' } },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true, useStrict: true } }
  ]
})
export class AddOutcomeComponent implements OnInit {
  outcomeForm: FormGroup;
  showEmployeeStatus = false;
  showOtherFields = false;
  programDeliveryDetails;
  programmeDeliveryId: Number;
  programDeliveryStartDate: String;
  maxContactDate = new Date();
  learnerId;
  learnerOutcomeData;
  userRefData: any;
  employerList: IEmployerNameList[] = [];
  filteredEmployerNameList: any;
  outcomeId;
  isNew: boolean = true;
  emailPattern = `([a-zA-Z0-9!@#$%^&*]{1,})`;
  outcomeStartDate;


  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly cdr: ChangeDetectorRef,
    private readonly learnerOutcomeService: LearnersOutcomeService
  ) {
  }

  ngOnInit() {
    this.resolveOutcome();
    this.outcomeForm.controls.employmentSectorId.valueChanges.subscribe(value => {
      if(value === 9) {
        this.outcomeForm.addControl('otherSectorValue', new FormControl(null,
           [Validators.required, Validators.maxLength(20), Validators.minLength(3), Validators.pattern(RegexPattern.allCharPattern)]));
      } else {
        this.outcomeForm.removeControl('otherSectorValue');
      }
    })
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  resolveOutcome() {
    this.initOutcomeForm();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.programmeDeliveryId = params.did;
      this.learnerId = params.id;
      if (params.oId) {
        this.isNew = false;
        this.outcomeId = params.oId;
        this.learnerOutcomeService.getUserOutcome(this.outcomeId).subscribe(data => {
          this.outcomeForm.patchValue(data);
          console.log("user out come ==>1",data);
          
        });
      }
    })
    this.getUserEmployerDetails();
    this.getUserRefData();
    // this.getProgramDeliveryDetails(this.programmeDeliveryId);
    // this.getUserOutcomeDataOnDelivery(this.learnerId, this.programmeDeliveryId);
  }

  prevent(event) {
    event.preventDefault();
  }


  initOutcomeForm() {
    this.outcomeForm = this.fb.group({
      id: [],
      contactDate: [null, [Validators.required]],
      contactStatusId: [null, [Validators.required]],
      employmentStatusId: [null],
      outcomeTypeId: [null],
      startDate: [null],
      employer: [null, [Validators.pattern(RegexPattern.allCharPattern)]],
      employmentTypeId: [],
      employmentSectorId: []
    });
  }

  onSubmit() {
    if (this.isNew) {
      this.createOutcome()
    } else {
      this.updateOutcome();
    }

  }
  updateOutcome() {
    const payload = this.outcomeForm.getRawValue();
    payload.learnerId = this.learnerId;
    payload.programmeDeliveryId = this.programmeDeliveryId;
    this.learnerOutcomeService.updateLearnerOutcome(payload).subscribe((resp) => {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge', queryParams: { oId: null } });
      this.snackBarService.success(resp.message.applicationMessage)
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  createOutcome() {
    const payload = this.outcomeForm.getRawValue();
    payload.learnerId = this.learnerId;
    payload.programmeDeliveryId = this.programmeDeliveryId;
    this.learnerOutcomeService.saveLearnerOutcome(payload).subscribe((resp) => {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge', queryParams: { oId: null } });
      this.snackBarService.success(resp.message.applicationMessage)
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }


  handleEnterKeyPress(event) {
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== "textarea") {
      return false;
    }
    event.preventDefault();
    return true;
  }

  onSelectContact(value) {
    if (value === 1) {
      this.showEmployeeStatus = true;
    } else {
      this.showEmployeeStatus = false;
      this.showOtherFields = false;
      this.setEmployeeStatusValidators();
      this.resetControls();
      this.setOutcomeFormValidators();
    }
  }

  setEmployeeStatusValidators() {
    this.outcomeForm.get("employmentStatusId").reset();
    this.outcomeForm.get("employmentStatusId").clearValidators();
    this.outcomeForm.get("employmentStatusId").updateValueAndValidity();
  }

  onSelectEmployeeStatus(value) {
    if (value == 1) {
      this.showOtherFields = true;
    } else {
      this.showOtherFields = false;
      this.resetControls();
      this.setOutcomeFormValidators();
    }
  }

  setOutcomeFormValidators() {
    this.outcomeForm.valid;
    this.outcomeForm.clearValidators();
    this.outcomeForm.updateValueAndValidity();
  }

  resetControls() {
    this.outcomeForm.get("outcomeTypeId").reset();
    this.outcomeForm.get("outcomeTypeId").clearValidators();
    this.outcomeForm.get("outcomeTypeId").updateValueAndValidity();

    this.outcomeForm.get("startDate").reset();
    this.outcomeForm.get("startDate").clearValidators();
    this.outcomeForm.get("startDate").updateValueAndValidity();

    this.outcomeForm.get("employer").reset();
    this.outcomeForm.get("employer").clearValidators();
    this.outcomeForm.get("employer").updateValueAndValidity();

    this.outcomeForm.get("employmentTypeId").reset();
    this.outcomeForm.get("employmentSectorId").reset();
  }

  getProgramDeliveryDetails(programDeliveryId) {
    this.learnerOutcomeService.getUserDeliveryData(programDeliveryId).subscribe(data => {
      console.log(data,"data2");
      
      this.programDeliveryDetails = data;
      console.log(this.programDeliveryDetails,"data3");
      this.programDeliveryStartDate = data.startDate

      /* setting program delivery start date + 1 */
      let ArrayDate = this.programDeliveryStartDate.split('-');
      ArrayDate[2] = (+ArrayDate[2] + 1).toString();
      this.outcomeStartDate = Utility.dateToString(Utility.transformStringToDate(ArrayDate.toString()));
      
    })
  }

  getUserOutcomeDataOnDelivery(learnerId, programDeliveryId) {
    this.learnerOutcomeService.getUserOutcomeDataOnDelivery(learnerId, programDeliveryId).subscribe(data => {
      this.learnerOutcomeData = data;
    })
  }

  getUserRefData() {
    this.learnerOutcomeService.getUserRefData().subscribe(data => {
      console.log(data,"data5");
      
      this.userRefData = data;
      ;
      
    })
  }

  getUserEmployerDetails() {
    this.learnerOutcomeService.getUserEmployer().subscribe(data => {
      this.employerList = data;
      return this.employerList;
    });
    this.filteredEmployerNameList = this.outcomeForm.controls.employer.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): IEmployerNameList[] {
    if (!value) {
      return this.employerList;;
    }
    const filterValue = value.toLowerCase();
    return this.employerList.filter((option: any) => option.employerName.toLowerCase().includes(filterValue));
  }

  onExit() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge', queryParams: { oId: null } });
  }

}
