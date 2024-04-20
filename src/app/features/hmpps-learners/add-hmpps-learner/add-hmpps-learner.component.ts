import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { LearnersService } from '../../learners/learners.services';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { CaptrLearnersService } from '../../captr-learners/captr-learners.services';
import { EditCaptrLeanerSteps } from '../../captr-learners/add-captr-learner/edit-captr-learner.steps';

@Component({
  selector: 'app-add-hmpps-learner',
  templateUrl: './add-hmpps-learner.component.html',
  styleUrls: ['./add-hmpps-learner.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AddHmppsLearnerComponent implements OnInit, OnDestroy {

  learnersForm: FormGroup;
  namePattern = `[^0-9\\r\\n\\t|\"]+$`;
  emailPattern = /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  isNew = false;
  userCategories;

  constructor(private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stepperNavigationService: StepperNavigationService) {
    this.captrLearnersService.getRefUserCategories().subscribe(data => this.userCategories = data);
  }



  ngOnInit(): void {
    this.initLearnersForm();
  }

  ngOnDestroy() {
    this.stepperNavigationService.stepper(null);
  }

  navigateHome() {
    this.router.navigate(['/hmpps-learner']);
  }

  initLearnersForm() {

    this.createLearnersForm();

    this.route.queryParams.subscribe((params: any) => {

      if (params.hasOwnProperty('id')) {

        this.isNew = false;

        this.captrLearnersService.getUserDetails(+params['id'])
          .subscribe(
            (data: any) => {
              this.learnersForm.patchValue(data);
              this.learnersForm.get('primaryLearnerDetails').get('emailAddress').patchValue(data.contactDetails.emailAddress);
              this.learnersForm.get('primaryLearnerDetails').get('emailAddress').disable();
              this.learnersForm.get('primaryLearnerDetails').get('userCategoryId').disable();
            },
            error => {
              this.snackBarService.error(`${error.error.applicationMessage}`);
              this.navigateHome();
            }
          );
      } else {
        this.isNew = true;
      }
    });
  }

  createLearnersForm() {
    this.learnersForm = this.fb.group({
      primaryLearnerDetails: this.getPrimaryLearnerDetails(),
    });
  }

  getPrimaryLearnerDetails() {
    const primaryLearnerDetailsForm = this.fb.group({
      id: [null],
      firstName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      lastName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.namePattern)]],
      dateOfBirth: [new Date('01/02/2000')],
      userCategoryId: [null, Validators.required],
      emailAddress: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
    })
    return primaryLearnerDetailsForm;
  }

  onSubmit() {
    this.isNew ? this.createLearner() : this.updateLearner();
  }

  createLearner() {
    const payload = this.learnersForm.getRawValue();

    payload.contactDetails = {
      emailAddress: payload.primaryLearnerDetails.emailAddress
    }

    payload.primaryLearnerDetails.dateOfBirth = Utility.transformDateToString(payload.primaryLearnerDetails.dateOfBirth);


   // console.log("Json on create", payload)
    this.captrLearnersService.saveNewLearners(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLearner() {
    const payload = this.learnersForm.getRawValue();

    payload.contactDetails = {
      emailAddress: payload.primaryLearnerDetails.emailAddress
    }

    payload.primaryLearnerDetails.dateOfBirth = Utility.transformDateToString(payload.primaryLearnerDetails.dateOfBirth);

    //console.log("Json on update", payload)
    this.captrLearnersService.updateLearners(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  createOrUpdateLearner() {
    const message = this.isNew ? 'Participant created successfully' : 'Participant updated successfully';
    this.snackBarService.success(message);
    this.router.navigate(['/hmpps-learner']);
  }

}
