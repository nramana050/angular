import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperNavigationService } from 'src/app/features/shared/components/stepper-navigation/stepper-navigation.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { CaptrLearnersService } from '../../captr-learners.services';
import { EditCaptrLeanerSteps } from '../edit-captr-learner.steps';

@Component({
  selector: 'app-further-information',
  templateUrl: './further-information.component.html',
  styleUrls: ['./further-information.component.scss']
})
export class FurtherInformationComponent implements OnInit, OnDestroy {

  learnersForm: FormGroup;
  unemployedFlag: any;
  maxDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 16));
  minDateOfBirth = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  lrnPattern = `[a-zA-Z0-9\ ]+`;
  prnPattern = `[A-Z][0-9]{4}[A-Z]{2}`;
  namePattern = `[^0-9\\r\\n\\t|\"]+$`;
  emailPattern = /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  postCodePattern =
    /^(([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2}$/;
  niNumberPattern =
    /^(?!BG)(?!GB)(?!NK)(?!KN)(?!TN)(?!NT)(?!ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}(\s?)[0-9]{2}(\s?)[0-9]{2}(\s?)[0-9]{2}(\s?)[A-D]{1}$/;
  phoneNumberPattern = /^(\d{7}|\d{11})$/;

  ethnicityRefData;
  refAnswer: any;
  titles = ['Ms', 'Mx', 'Mrs', 'Miss', 'Mr', 'Dr', 'Prof', 'Lady', 'Sir', 'Rev', 'Lord', 'Maj',
    'Capt', 'Pte', 'Sgt', 'Ssgt', 'Lt', 'Col', 'Brig', 'Cpl', 'Lcpl', '2Lt', 'WO1', 'WO2', 'Master', 'Other', 'N/A'];

  isNew = false;
  genderList: any;
  highLevelQualificationList: any
  deactivated: boolean;
  ethnicityList
  onlyCharsPattern = /^([a-zA-Z]+\s)*[a-zA-Z]+$/;
  firstNamePattern = `([a-zA-Z]{1,})`;
  lastNamePattern = `([a-zA-Z]{1,}(\\s?|'?|-?)[a-zA-Z]{1,})`;
  refData;
  idAndDocFlag = false;
  externalSupport = false;
  refStatus = [{
    id: 1,
    status: "Still trading"
  }]
  isCheckedSupport;
  isReferralTypeId: any;

  constructor(private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly editCaptrLeanerSteps: EditCaptrLeanerSteps) {
    this.stepperNavigationService.stepper(this.editCaptrLeanerSteps.stepsConfig);
    this.captrLearnersService.getRefAnswer().subscribe(data => {
      this.refAnswer = data;
      this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')

    })

  }

  ngOnInit(): void {
    this.stepperNavigationService.stepper(this.editCaptrLeanerSteps.stepsConfig);
    this.getRefDataAndInitForm()
  }
  getRefDataAndInitForm() {
    this.captrLearnersService.getFurtherInfoRefData().subscribe(data => {
      this.refData = data;
      this.initLearnersForm()

    })
  }

  ngOnDestroy() {
    this.stepperNavigationService.stepper(null);
  }

  navigateHome() {
    this.router.navigate(['./captr-learner']);
  }

  initLearnersForm() {
    this.createLearnersForm();
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.learnersForm.get('learnerId').patchValue(+params['id'])
        this.isNew = false;
        this.captrLearnersService.getFurtherInfo(+params['id'])
          .subscribe(
            (data: any) => {
              this.isReferralTypeId = data.referalInformation.referalTypeId
              this.learnersForm.patchValue(data);
              this.patchExteranSupport(data.externalSupports.externalSupportList);
              this.patchIdAndDocuments(data.idAndDocuments.idAndDocumentList);
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

  patchIdAndDocuments(idAndDocumentList: any) {

    this.idAndDocumentForm.reset();

    idAndDocumentList.forEach(data => {
      const docIds = this.refData.document.map(d => d.id);
      const index = docIds.indexOf(data.documentId);
      this.idAndDocumentForm.at(index).get('documentId').patchValue(data.documentId);
      this.idAndDocumentForm.at(index).get('documentLocation').patchValue(data.documentLocation);
      this.idAndDocumentForm.at(index).get('documentDescription').patchValue(data.documentDescription);
    });

  }

  patchExteranSupport(externalSupportList: any) {

    this.externalSupportForm.reset();

    externalSupportList.forEach(element => {
      const supportAreaIds = this.refData.supportArea.map(s => s.id);
      const index = supportAreaIds.indexOf(element.supportAreaId);
      this.externalSupportForm.at(index).get('supportAreaId').patchValue(element.supportAreaId)
      this.externalSupportForm.at(index).get('providingSupport').patchValue(element.providingSupport)
      this.externalSupportForm.at(index).get('supportDetails').patchValue(element.supportDetails)
    });

  }

  checkSupportId(i, item) {
    let currnet_group = this.externalSupportForm.at(i) as FormGroup;
    if (this.externalSupportForm.at(i).get('supportAreaId').value) {
      if(!currnet_group.get('providingSupport') && !currnet_group.get('supportDetails')){
        currnet_group.addControl('providingSupport', new FormControl('', Validators.required))
        currnet_group.addControl('supportDetails', new FormControl('', Validators.required))
      }
      this.externalSupportForm.at(i).get('supportAreaId').patchValue(item.id)
      this.idAndDocumentForm.at(i).get('providingSupport').addValidators([Validators.required])
      this.idAndDocumentForm.at(i).get('supportDetails').addValidators([Validators.required])
    }
    else {
      this.externalSupportForm.at(i).get('supportAreaId').patchValue(null)
      currnet_group.removeControl('providingSupport');
      currnet_group.removeControl('supportDetails');
    }
  }

  checkIdAndDoc(i, item) {
    
    let currnet_group = this.idAndDocumentForm.at(i) as FormGroup;
    if (this.idAndDocumentForm.at(i).get('documentId').value) {
      if(!currnet_group.get('documentLocation') && !currnet_group.get('documentDescription')){
        currnet_group.addControl('documentLocation', new FormControl('', Validators.required))
        currnet_group.addControl('documentDescription', new FormControl('', Validators.required))
      }
      this.idAndDocumentForm.at(i).get('documentId').patchValue(item.id)
      this.idAndDocumentForm.at(i).get('documentLocation').addValidators([Validators.required])
      this.idAndDocumentForm.at(i).get('documentDescription').addValidators([Validators.required])
    }
    else {
      this.idAndDocumentForm.at(i).get('documentId').patchValue(null)
      currnet_group.removeControl('documentLocation');
      currnet_group.removeControl('documentDescription');
    }        
  }

  createLearnersForm() {
    this.learnersForm = this.fb.group({
      learnerId: [null],
      referalInformation: this.getReferralInformationDetails(),
      prisonInformation: this.getPrisonInformationForm(),
      externalSupports: this.getExternalSupports(),
      idAndDocuments: this.getIdAndDocuments(),
      selfEmployment: this.getSelfEmploymentForm(),
    });

    this.refData.supportArea.forEach(data => {
      this.externalSupportForm.push(this.fb.group({
        supportAreaId: [],
        providingSupport: [null, [Validators.maxLength(50)]],
        supportDetails: [null, [Validators.maxLength(100)]]
      }));
    });

    this.refData.document.forEach(doc => {
      this.idAndDocumentForm.push(this.fb.group({
        documentId: [],
        documentDescription: [null, [Validators.maxLength(50)]],
        documentLocation: [null, [Validators.maxLength(50)]],
      }))
    })
  }


  getReferralInformationDetails() {
    const referralInformationForm = this.fb.group({
      referalTypeId: [null, [Validators.required]],
      referalDetails: [null, [Validators.required, Validators.maxLength(100)]],
      referalName: [null, [Validators.required, Validators.maxLength(100)]],
      contactNumber: [null, [Validators.required, Validators.pattern(this.phoneNumberPattern)]],
      referalOrganization: [null, [Validators.required, Validators.maxLength(100)]],
      contactEmail: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      hearAboutService: [null, [Validators.required, Validators.maxLength(100)]]
    })
    return referralInformationForm;
  }

  getExternalSupports() {
    const externalSupports = this.fb.group({
      externalSupportList: new FormArray([])
    })
    return externalSupports;
  }

  getIdAndDocuments() {
    const idAndDocuments = this.fb.group({
      idAndDocumentList: new FormArray([])
    })
    return idAndDocuments;
  }



  getSelfEmploymentForm() {
    const selfEmploymentForm = this.fb.group({
      id: [null],
      businessIdea: [null, [Validators.required, Validators.maxLength(2000)]],
      isProbation: [null],
      isPreviouslySelfEmployed: [null],
      utrNumber: [null, [Validators.maxLength(10), Validators.minLength(10)]],
      tradingStatus: [null]
    })
    return selfEmploymentForm;
  }

  getPrisonInformationForm() {
    const prisonInformationForm = this.fb.group({
      id: [null],
      isReleasedFromPrisonInLastTwoYears: [null],
      prisonReleasedFrom: [null, [Validators.maxLength(150)]],
      dateOfRelease: [null],
      licenceBailCondition: [null, [Validators.maxLength(500)]],
    })
    return prisonInformationForm;
  }

  onSubmit() {
    if (!this.isReferralTypeId) {
      this.createLearner();
    } else {
      this.updateLearner();
    }
  }

  createLearner() {
    const payload = this.learnersForm.getRawValue();
    this.captrLearnersService.saveFurtherInfo(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLearner() {
    const payload = this.learnersForm.getRawValue();
    this.captrLearnersService.updateFurtherInfo(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  createOrUpdateLearner() {
    let message;
    if (this.learnersForm.get('referalInformation').get('referalTypeId').value) {
      message = 'Learner further information saved successfully';
    } else {
      message = 'Learner further information updated successfully';
    }
    this.snackBarService.success(message);
    this.router.navigate(['./captr-learner']);
  }

  get externalSupportForm() {
    return this.learnersForm.get('externalSupports').get('externalSupportList') as FormArray;
  }
  get idAndDocumentForm() {
    return this.learnersForm.get('idAndDocuments').get('idAndDocumentList') as FormArray;
  }
}


