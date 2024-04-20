import { Component, DebugElement, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { EditMentivityLeanerSteps } from '../add-mentivity-learners/edit-mentivity-learner.steps';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CaptrLearnersService } from '../../captr-learners/captr-learners.services'
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { MentivityService } from '../mentivity-learners.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/framework/components/date-adapter/date-adapter';


@Component({
  selector: 'app-mentivity-further-info',
  templateUrl: './mentivity-further-info.component.html',
  styleUrls: ['./mentivity-further-info.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class MentivityFurtherInfoComponent implements OnInit {

  learnersForm: FormGroup;
  namePattern = `[^0-9\\r\\n\\t|\"]+$`;
  emailPattern = /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  phoneNumberPattern = /^(\d{7}|\d{11})$/;
  refAnswer: any;
  isNew = false;
  refData;
  idAndDocFlag = false;
  externalSupport = false;
  isReferralTypeId: any;
  allData;
 
  isotherOverallOutcome: boolean;
  otherRegex = /^[a-zA-Z][a-zA-Z0-9@' -]*$/;
  isPrisoner;
  constructor(private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly mentivityService: MentivityService,
    private readonly editMentivityLeanerSteps: EditMentivityLeanerSteps) {
    this.stepperNavigationService.stepper(this.editMentivityLeanerSteps.stepsConfig);
    this.captrLearnersService.getRefAnswer().subscribe(data => {
      this.refAnswer = data;
      this.refAnswer = this.refAnswer.filter(ref => ref.identifier !== 'PNS')

    })
    
  }

  ngOnInit(): void {
    this.findRefData();
    this.getRefDataAndInitForm()
  }
  async findRefData(){
    await this.mentivityService.getRefDataAllDetails().toPromise().then(data => {
      this.allData = data;
    })
  }

  async getRefDataAndInitForm() {
    await this.captrLearnersService.getFurtherInfoRefData().toPromise().then(data => {
      this.refData = data;
      this.initLearnersForm()
    })
    
  }

  ngOnDestroy() {
    this.stepperNavigationService.stepper(null);
  }

  navigateHome() {
    this.router.navigate(['./mentivity-learner']);
  }

  initLearnersForm() {
   
    this.createLearnersForm();
    
    this.route.queryParams.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.learnersForm.get('participantId').patchValue(+params['id'])
        this.isNew = false;
        this.mentivityService.getFurtherInfo(+params['id'])
          .subscribe(
            (data: any) => {
            this.isReferralTypeId = data.referalInformation.isReferralTypeId;
            this.learnersForm.patchValue(data);
            if(data.prisonInformation.isReleasedFromPrisonInLastTwoYears) {
              this.isPrisoner =true;
            }

            let outcome = this.learnersForm.get('referalInformation').get('overallOutcome').value;
            if(outcome!=null && outcome.includes(547))
            {
              this.isotherOverallOutcome = true;
            }
           
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
      if (!currnet_group.get('providingSupport') && !currnet_group.get('supportDetails')) {
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
      if (!currnet_group.get('documentLocation') && !currnet_group.get('documentDescription')) {
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
      participantId: [null],
      referalInformation: this.getReferralInformationDetails(),
      prisonInformation: this.getPrisonInformationForm(),
      externalSupports: this.getExternalSupports(),
      idAndDocuments: this.getIdAndDocuments(),
      selfEmploymentId: [null],
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
      isReferralTypeId: [null],
      madeReferral: [null, [Validators.pattern(this.otherRegex),Validators.required,Validators.maxLength(100),Validators.minLength(3)]],
      referalName: [null, [Validators.required, Validators.maxLength(100)]],
      contactNumber: [null, [Validators.required, Validators.pattern(this.phoneNumberPattern)]],
      referalOrganization: [null, [Validators.required, Validators.maxLength(100)]],
      contactEmail: [null, [Validators.required, Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      hearAboutService: [null, [Validators.required, Validators.maxLength(100)]],
      overallOutcome: [null],
      otherOverallOutcome: [null,[Validators.pattern(this.otherRegex),Validators.maxLength(100),Validators.minLength(3)]],
      secondaryOutcomes: [null],
      otherSecondaryOutcomes: [null,[Validators.pattern(this.otherRegex),Validators.maxLength(100),Validators.minLength(3)]]
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
    this.mentivityService.saveFurtherInfo(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  updateLearner() {
    const payload = this.learnersForm.getRawValue();
    this.mentivityService.updateFurtherInfo(payload).subscribe(() => {
      this.createOrUpdateLearner();
    },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      })
  }

  createOrUpdateLearner() {
    let message;
    if (!this.learnersForm.get('referalInformation').get('isReferralTypeId').value) {
      message = 'Learner further information saved successfully';
    } else {
      message = 'Learner further information updated successfully';
    }
    this.snackBarService.success(message);
    this.router.navigate(['./mentivity-learner']);
  }

  get externalSupportForm() {
    return this.learnersForm.get('externalSupports').get('externalSupportList') as FormArray;
  }
  get idAndDocumentForm() {
    return this.learnersForm.get('idAndDocuments').get('idAndDocumentList') as FormArray;
  }


  otherOverallOutCome(event){
    const selectedValues =  this.learnersForm.controls['referalInformation'].get('overallOutcome').value;
   
  if(selectedValues.includes(547)){
    this.isotherOverallOutcome =  true;

  }else{
             this.learnersForm.controls['referalInformation'].get('otherOverallOutcome').clearValidators();
            this.learnersForm.controls['referalInformation'].get('otherOverallOutcome').reset();
             this.isotherOverallOutcome =false;
           }
 }

  secOtherOutcome() {

    if ((this.learnersForm.controls['referalInformation'].get('secondaryOutcomes').value === 572)) {
      return true;
    }
    else {
      this.learnersForm.controls['referalInformation'].get('otherSecondaryOutcomes').reset();
      return false;
    }
  }

  resetfield(event){
    if(event == true){
      this.isPrisoner =true;
    } else{
      this.isPrisoner=false; 
      this.learnersForm.get('prisonInformation').get('prisonReleasedFrom').clearValidators();
      this.learnersForm.get('prisonInformation').get('prisonReleasedFrom').reset();
      this.learnersForm.get('prisonInformation').get('dateOfRelease').clearValidators();
      this.learnersForm.get('prisonInformation').get('dateOfRelease').reset();
      this.learnersForm.get('prisonInformation').get('licenceBailCondition').clearValidators();
      this.learnersForm.get('prisonInformation').get('licenceBailCondition').reset();
    

     }
  }
}
