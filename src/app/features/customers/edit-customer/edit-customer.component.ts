import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../app/framework/service/snack-bar.service';
import { CustomersService } from '../customers.service';
import { RegexPattern } from 'src/app/framework/constants/regex-constant';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {
  customer: any;
  customerForm: FormGroup;
  customerNamePattern = /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/;
  colourNamePattern = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  identifierPattern = /^[A-Z0-9]+$/;
  customerListURL = './customers';
  isNew = true;
  disableSaveButton: Boolean = false;
  logoTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  logoFile: File;
  refAnswer = ['Yes', 'No']
  showSuFields = false;
  suLogoFile: File;
  kwAppId;
  suAppId;
  featureOptionsKw: any[];
  searchDataKw = {
    keyword: ''
  };

  searchDataKwSubFeature = {
    keyword: ''
  };
  keywordFilterCtrlKw: FormControl = new FormControl();
  keywordFilterCtrlKwSubFeature: FormControl = new FormControl();
  allFeaturesKw: any[];
  showSelectedFeatureKw: boolean = false;
  featureOptionsSu: any[];
  searchDataSu = {
    keyword: ''
  };
  searchDataSuSubFeature = {
    keyword: ''
  };
  keywordFilterCtrlSu: FormControl = new FormControl();
  keywordFilterCtrlSuSubFeature: FormControl = new FormControl();
  allFeaturesSu: any[];
  showSelectedFeatureSu: boolean = false;
  clientId;
  refDomain;
  showKwSubFeatures = false;
  showSuSubFeatures = false;
  allIntegers = RegexPattern.allIntegers;
  subFeatureOptionsKw = [];
  subFeatureOptionsSu = [];
  KwSuFeaturesSubFeatures;
  selectedKwMainFeatureId;
  selectedSuMainFeatureId;
  featureIndexKw;
  featureIndexSu;
  allSubFeaturesKw = [];
  allSubFeaturesSu = [];
  isGenaieSelected: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackBar: SnackBarService,
    private readonly customerService: CustomersService,
    private readonly location: Location,
  ) {
    this.getFeatureSubFeatureData();
  }

  ngOnInit() {
    this.getRefDomain();
    this.initCustomerForm();
    this.resolveCustomer();
    this.colourValidation();
    this.suColourValidation();
    this.UrlValidation();
  }

  async getFeatureSubFeatureData() {

    this.onFilterKw('');
    this.onFilterSu('');
    try {
      const data = await this.customerService.getFeaturesSubFeatures().toPromise();
      this.KwSuFeaturesSubFeatures = data;
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }


  getRefDomain() {
    this.customerService.getRefDomains().subscribe(data => {
      this.refDomain = data;
    })
  }

  async resolveCustomer() {

    this.activatedRoute.params.subscribe((params: any) => {
      if (params.id) {
        this.clientId = params.id
        this.isNew = false;
        this.updateFormControls();

        this.customerService.getCustomerDetailsById(params.id).subscribe(resp => {
          this.customer = resp
          this.kwAppId = resp.kwAppDetails.appId;
          if (this.customer.suAppDetails) {
            this.suAppId = resp.suAppDetails.appId;
            this.customer.isSUAppRequired = true;
          }
          else {
            this.customer.isSUAppRequired = false;
          }

          this.customerForm.patchValue(this.customer);
          if (this.customer.suAppDetails) {
            this.customerForm.get('suAppDetails').patchValue(this.customer.suAppDetails)

            const suFeaturesArray = this.customer.suAppDetails.features;
            (this.customerForm.get('suAppDetails.features') as FormArray).clear();
            suFeaturesArray.forEach(async (featureGroup, featureIndex) => {
              const optionFeature = await this.findSUFeatureAsync(featureGroup.featureId);
              this.selectSu(optionFeature)
              const subFeatureIds = featureGroup.subFeatureIds
              subFeatureIds.forEach((subFeatureNumber) => {
                const optionSubFeature = this.subFeatureOptionsSu.find(item => item.featureId === subFeatureNumber);
                this.selectSuSubFeature(optionSubFeature);
              });
            });

          }

          const kwFeaturesArray = this.customer.kwAppDetails.features;
          (this.customerForm.get('kwAppDetails.features') as FormArray).clear();
          kwFeaturesArray.forEach(async (featureGroup, featureIndex) => {
            const optionFeature = await this.findKWFeatureAsync(featureGroup.featureId);
            this.selectKw(optionFeature)
            const subFeatureIds = featureGroup.subFeatureIds
            subFeatureIds.forEach((subFeatureNumber) => {
              const optionSubFeature = this.subFeatureOptionsKw.find(item => item.featureId === subFeatureNumber);
              this.selectKwSubFeature(optionSubFeature);
            });
          });

        }, error => {
          this.location.back();
          this.snackBar.error(error.error.applicationMessage);
        });

      }
    })
    console.log(this.customerForm);
    
  }

  async findKWFeatureAsync(featureIdToFind: number) {
    return new Promise((resolve) => {
      const feature = this.featureOptionsKw.find((item) => item.featureId === featureIdToFind);
      if (feature)
        resolve(feature);
      else
        this.findKWFeatureAsync(featureIdToFind)

    });
  }

  async findSUFeatureAsync(featureIdToFind: number) {
    return new Promise((resolve) => {
      const feature = this.featureOptionsSu.find(item => item.featureId === featureIdToFind);
      if (feature)
        resolve(feature);
      else
        this.findSUFeatureAsync(featureIdToFind)
    });
  }

  initCustomerForm() {
    this.customerForm = this.fb.group({
      clientDetails: this.getClientDetails(),
      kwAppDetails: this.getKwAppDetails(),
      isSUAppRequired: [null, [Validators.required]],
      suAppDetails: this.getSuAppDetails(),
      isSelfRegisterAllowed: [null],
    });

    const input = (document.querySelector('input[type=file]') as HTMLInputElement);
    const preview = document.querySelector('.preview');
    input.addEventListener('change', updateImageDisplay);

    function updateImageDisplay() {
      while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
      }

      const curFiles = input.files ? input.files : [];
      const list = document.createElement('div');
      preview.appendChild(list);
      for (const file of curFiles as Array<any>) {
        const listItem = document.createElement('span');
        const para = document.createElement('p');
        if (validFileType(file)) {
          para.textContent = file.name;
          listItem.appendChild(para);
          this.disableSaveButton = false;
        } else {
          para.style.color = 'red';
          para.style.fontSize = '14px';
          para.textContent = 'Not a valid file type. Update your selection.';
          listItem.appendChild(para);
          this.disableSaveButton = true;
        }
        list.appendChild(listItem);
      }
    }
    const fileTypes = ['image/jpeg', 'image/png'];

    function validFileType(file) {
      for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i] && !file.name.includes('.jfif')) {
          return true;
        }
      }
      return false;
    }

  }

  getClientDetails() {
    return this.fb.group({
      id: [],
      clientName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(this.customerNamePattern)]],
      identifier: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(this.identifierPattern)]],
      isMoodleUser: [null, [Validators.required]],
      domainId: [null, [Validators.required]],
      isActive: [false],
      noOfCourseGenerated:[''],
      noOfCourseApproved:[''],
    });
  }

  getKwAppDetails() {
    return this.fb.group({
      appUrl: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      primaryColour: ['', [Validators.required, Validators.pattern(this.colourNamePattern)]],
      secondaryColour: ['', [Validators.required, Validators.pattern(this.colourNamePattern)]],
      file: [null, [Validators.required, Validators.maxLength(100)]],
      logoName: [],
      logoPath: [],
      appId: [],
      features: this.fb.array([], [Validators.required]),
      licences: [null, [Validators.required, Validators.pattern(this.allIntegers)]]
    });
  }

  get kwFeaturesFormArray() {
    return this.customerForm.get('kwAppDetails.features') as FormArray;
  }

  addKwFeature() {
    const feature = this.fb.group({
      featureId: [null],
      subFeatureIds: this.fb.array([]),
    });
    this.kwFeaturesFormArray.push(feature);
  }

  addKwSubFeature(option) {
    const subFeatureFormArray = this.kwFeaturesFormArray.at(this.featureIndexKw).get('subFeatureIds') as FormArray;
    subFeatureFormArray.push(
      this.fb.group({
        featureId: [option.featureId],
      })
    );
  }

  removeKwSubFeature(option, index) {
    this.updateKeywordSubFeatureVisibilityKw(option.featureId, true);
    option.invisible = false;
    const subFeatureFormArray = this.kwFeaturesFormArray.at(this.featureIndexKw).get('subFeatureIds') as FormArray;
    subFeatureFormArray.removeAt(index);
  }

  selectKw(option) {
    this.isGenaieFeatureSelected(option)
    this.selectedKwMainFeatureId = option.featureId;
    option.invisible = true;
    this.addKwFeature();
    this.kwFeaturesFormArray.at(this.kwFeaturesFormArray.length - 1).get('featureId').patchValue(option.featureId)
    this.selectKwSubFeatures(option)
    if (this.showKwSubFeatures) {
      console.log(this.kwFeaturesFormArray.at(this.kwFeaturesFormArray.length - 1).get('subFeatureIds'));

      this.kwFeaturesFormArray.at(this.kwFeaturesFormArray.length - 1).get('subFeatureIds').clearValidators();
      this.kwFeaturesFormArray.at(this.kwFeaturesFormArray.length - 1).get('subFeatureIds').addValidators([Validators.required])
      this.kwFeaturesFormArray.at(this.kwFeaturesFormArray.length - 1).get('subFeatureIds').updateValueAndValidity();
    }
  }

  removeKw(index, keyword) {
    if (keyword.featureId == 78) {
      this.customerForm.get('clientDetails.noOfCourseGenerated').removeValidators([Validators.required,Validators.max(5000), Validators.pattern(this.allIntegers)]);
      this.customerForm.get('clientDetails.noOfCourseApproved').removeValidators([Validators.required,Validators.max(2500), Validators.pattern(this.allIntegers)]);
      this.customerForm.get('clientDetails.noOfCourseGenerated').reset();
      this.customerForm.get('clientDetails.noOfCourseApproved').reset();
      this.isGenaieSelected = false;
    }
    this.updateKeywordVisibilityKw(keyword.featureId, true);
    this.updateAllKeywordSubFeatureVisibilityKw(keyword.featureId, true,index);
    keyword.invisible = false;
    this.kwFeaturesFormArray.removeAt(index);
    this.showKwSubFeatures = false
  }

  selectKwSubFeature(option) {
    option.invisible = true;
    this.addKwSubFeature(option);
  }

  colourValidation() {
    let primaryColour;
    let secondaryColour;
    this.customerForm.get('kwAppDetails.primaryColour').valueChanges.subscribe(value1 => {
      primaryColour = value1;
      if (primaryColour && secondaryColour && primaryColour === secondaryColour) {
        this.customerForm.get('kwAppDetails.primaryColour').setErrors({ 'incorrect': true });
      }
    })
    this.customerForm.get('kwAppDetails.secondaryColour').valueChanges.subscribe(value2 => {
      secondaryColour = value2;
      if (primaryColour && secondaryColour && primaryColour === secondaryColour) {
        this.customerForm.get('kwAppDetails.secondaryColour').setErrors({ 'incorrect': true });
      }
    })
  }

  onSubmit() {
    this.isNew ? this.createCustomer() : this.updateCustomer();
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validFileType(file)) {
        this.disableSaveButton = false;
        this.logoFile = file
      } else {
        this.disableSaveButton = true;
      }
    }
  }

  selectSuFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validFileType(file)) {
        this.disableSaveButton = false;
        this.suLogoFile = file
      } else {
        this.disableSaveButton = true;
      }
    }
  }

  fileValidate() {
    const vidFile = (document.getElementById('image_uploads') as HTMLInputElement)
      .files.length;
    if (vidFile === 0) {
      const preview = document.querySelector('.preview');
      const parat = document.createElement('p');
      parat.textContent = 'No files currently selected for upload';
      preview.appendChild(parat);
    }
  }

  validFileType(file) {
    for (let i = 0; i < this.logoTypes.length; i++) {
      if (file.type === this.logoTypes[i] && !file.name.includes('.jfif')) {
        return true;
      }
    }
    return false;
  }

  createCustomer() {
    if (this.customerForm.valid) {
      const featuresArray = this.customerForm.get('kwAppDetails.features') as FormArray;
      featuresArray.controls.forEach((featureGroup) => {
        const subFeatureIds = featureGroup.get('subFeatureIds') as FormArray;
        const subFeatureNumbers = [];
        subFeatureIds.controls.forEach((subFeature) => {
          const subFeatureId = subFeature.get('featureId').value;
          subFeatureNumbers.push(subFeatureId);
        });
        subFeatureIds.clear();
        subFeatureNumbers.forEach((subFeatureNumber) => {
          subFeatureIds.push(this.fb.control(subFeatureNumber));
        });
      });
      if (this.showSuFields) {
        const featuresArray = this.customerForm.get('suAppDetails.features') as FormArray;
        featuresArray.controls.forEach((featureGroup) => {
          const subFeatureIds = featureGroup.get('subFeatureIds') as FormArray;
          const subFeatureNumbers = [];
          subFeatureIds.controls.forEach((subFeature) => {
            const subFeatureId = subFeature.get('featureId').value;
            subFeatureNumbers.push(subFeatureId);
          });
          subFeatureIds.clear();
          subFeatureNumbers.forEach((subFeatureNumber) => {
            subFeatureIds.push(this.fb.control(subFeatureNumber));
          });
        });
      }
      const payload = this.customerForm.getRawValue();
      const formData = new FormData();
      formData.append('file', this.logoFile);
      formData.append('identifier', payload.clientDetails.identifier);
      this.uploadLogo(payload, formData)
    }
  }

  uploadLogo(payload, formData) {
    this.customerService.uploadLogo(formData).then((data: any) => {
      const image = JSON.parse(data);
      payload.kwAppDetails.logoName = image.logoName;
      payload.kwAppDetails.logoPath = image.logoPath;

      if (payload.isSUAppRequired === true) {
        this.uploadSuLogoAndSaveClient(payload)
      } else {
        this.saveClient(payload)
      }

    });

  }

  saveClient(payload: any) {
    this.customerService.creatNewCustomer(payload).subscribe(() => {
      this.createOrUpdateCustomer();
    }, error => {
      this.location.back();
      this.snackBar.error(error.error.applicationMessage);
    });
  }

  uploadSuLogoAndSaveClient(payload) {
    const suFormData = new FormData()
    suFormData.append('file', this.suLogoFile);
    suFormData.append('identifier', payload.clientDetails.identifier);
    this.customerService.uploadLogo(suFormData).then((data: any) => {
      const image = JSON.parse(data);
      payload.suAppDetails.logoName = image.logoName;
      payload.suAppDetails.logoPath = image.logoPath;
      this.saveClient(payload)
    });
  }

  createOrUpdateCustomer() {
    this.fileValidate();
    const message = this.isNew ? 'Customer created successfully' : 'Customer updated successfully';
    this.snackBar.success(message);
    this.router.navigate([this.customerListURL]);
  }

  async updateCustomer() {
    
    if (this.customerForm.valid && confirm("Are you sure you want to update ?")) {
      const featuresArray = this.customerForm.get('kwAppDetails.features') as FormArray;
      featuresArray.controls.forEach((featureGroup) => {
        const subFeatureIds = featureGroup.get('subFeatureIds') as FormArray;
        const subFeatureNumbers = [];
        subFeatureIds.controls.forEach((subFeature) => {
          const subFeatureId = subFeature.get('featureId').value;
          subFeatureNumbers.push(subFeatureId);
        });
        subFeatureIds.clear();
        subFeatureNumbers.forEach((subFeatureNumber) => {
          subFeatureIds.push(this.fb.control(subFeatureNumber));
        });
      });
      if (this.showSuFields) {
        const featuresArray = this.customerForm.get('suAppDetails.features') as FormArray;
        featuresArray.controls.forEach((featureGroup) => {
          const subFeatureIds = featureGroup.get('subFeatureIds') as FormArray;
          const subFeatureNumbers = [];
          subFeatureIds.controls.forEach((subFeature) => {
            const subFeatureId = subFeature.get('featureId').value;
            subFeatureNumbers.push(subFeatureId);
          });
          subFeatureIds.clear();
          subFeatureNumbers.forEach((subFeatureNumber) => {
            subFeatureIds.push(this.fb.control(subFeatureNumber));
          });
        });
      }

      const payload = this.customerForm.getRawValue();
      const formData = new FormData();
      formData.append('file', this.logoFile);
      formData.append('identifier', payload.clientDetails.identifier);
      formData.append('id', this.kwAppId);
        const data: any = await this.customerService.uploadLogo(formData);
        const image = JSON.parse(data);
        payload.kwAppDetails.logoName = image.logoName;
        payload.kwAppDetails.logoPath = image.logoPath;

        if (this.customer.suAppDetails && this.customerForm.controls.suAppDetails.value) {
          this.uploadSuLogoAndUpdateClient(payload);
        } else {
          this.customerService.updateCustomer(payload).subscribe(() => {
            this.createOrUpdateCustomer()
          }, error => {
            this.location.back();
            this.snackBar.error(error.error.applicationMessage);
          });
        }
    }
  }

  getSuAppDetails() {
    return this.fb.group({
      appId: [],
      appUrl: ['', [Validators.required, Validators.pattern('(https:\\/\\/www\\.|http:\\/\\/www\\.|https:\\/\\/|http:\\/\\/)?[a-z0-9-]{2,}\\.[a-z0-9]{2,}\\.[a-z0-9]{2,}?')]],
      primaryColour: ['', [Validators.required, Validators.pattern(this.colourNamePattern)]],
      secondaryColour: ['', [Validators.required, Validators.pattern(this.colourNamePattern)]],
      suAppfile: [null, [Validators.required, Validators.maxLength(100)]],
      logoName: [],
      logoPath: [],
      licences: [null, [Validators.required, Validators.pattern(this.allIntegers)]],
      features: this.fb.array([], [Validators.required]),
    });
  }

  suColourValidation() {
    let suPrimaryColour;
    let suSecondaryColour;
    this.customerForm.controls.suAppDetails.get('primaryColour').valueChanges.subscribe(value1 => {
      suPrimaryColour = value1;
      if (suPrimaryColour && suSecondaryColour && suPrimaryColour === suSecondaryColour) {
        this.customerForm.controls.suAppDetails.get('primaryColour').setErrors({ 'incorrect': true });
      }
    })
    this.customerForm.controls.suAppDetails.get('secondaryColour').valueChanges.subscribe(value2 => {
      suSecondaryColour = value2;
      if (suPrimaryColour && suSecondaryColour && suPrimaryColour === suSecondaryColour) {
        this.customerForm.controls.suAppDetails.get('secondaryColour').setErrors({ 'incorrect': true });
      }
    })
    this.customerForm.controls.isSUAppRequired.valueChanges.subscribe(value => {
      if (value === true) {
        this.customerForm.addControl('suAppDetails', this.getSuAppDetails());
        this.customerForm.controls.suAppDetails.reset();
        this.showSuFields = true;
      }
      else {
        this.showSuFields = false;
        this.customerForm.removeControl('suAppDetails');
      }
    })
  }

  private updateFormControls() {
    this.customerForm.get('suAppDetails').get('appUrl').disable();
    (this.customerForm?.get('clientDetails') as FormGroup)?.removeControl('isMoodleUser');
    (this.customerForm?.get('clientDetails') as FormGroup)?.removeControl('baseAppId');
    (this.customerForm?.get('clientDetails') as FormGroup)?.removeControl('domainId');
    (this.customerForm?.get('kwAppDetails') as FormGroup)?.get('file').clearValidators();
    (this.customerForm?.get('kwAppDetails') as FormGroup)?.get('file').updateValueAndValidity();
    (this.customerForm?.get('suAppDetails') as FormGroup)?.get('suAppfile').clearValidators();
    (this.customerForm?.get('suAppDetails') as FormGroup)?.get('suAppfile').updateValueAndValidity();
  }

  UrlValidation() {
    let kwUrl;
    let suUrl;
    this.customerForm.get('kwAppDetails.appUrl').valueChanges.subscribe(value1 => {
      kwUrl = value1;
      if (kwUrl && suUrl && kwUrl === suUrl) {
        this.customerForm.get('kwAppDetails.appUrl').setErrors({ 'incorrect': true });
      }
    })

    this.customerForm.get('suAppDetails.appUrl').valueChanges.subscribe(value2 => {
      suUrl = value2;
      if (kwUrl && suUrl && kwUrl === suUrl) {
        this.customerForm.get('suAppDetails.appUrl').setErrors({ 'incorrect': true });
      }
    })
  }


  async uploadSuLogoAndUpdateClient(payload) {


    const suFormData = new FormData()
    suFormData.append('file', this.suLogoFile);
    suFormData.append('identifier', payload.clientDetails.identifier);
    suFormData.append('id', this.suAppId);

    const data: any = await this.customerService.uploadLogo(suFormData);

    const image = JSON.parse(data);

    payload.suAppDetails.logoName = image.logoName;
    payload.suAppDetails.logoPath = image.logoPath;

    this.customerService.updateCustomer(payload).subscribe(() => {
      this.createOrUpdateCustomer()
    }, error => {
      this.location.back();
      this.snackBar.error(error.error.applicationMessage);
    });

  }

  async onFilterKw(value) {
    this.searchDataKw.keyword = value;
    await this.resolveFeatureOptionsKw()
  }

  async resolveFeatureOptionsKw(initial?: boolean) {
    try {
      const data = await this.customerService.getKwFeatures(this.searchDataKw).toPromise();

      if (!this.searchDataKw.keyword) {
        this.allFeaturesKw = data;
        this.showSelectedFeatureKw = true;
      }

      this.featureOptionsKw = data;
      this.featureOptionsKw.forEach((f) => (f.id = f.featureId));

      const listSelected = (this.customerForm.get('kwAppDetails.features') as FormArray).value.map((obj: any) => obj);
      listSelected.forEach((each) => {
        const feature = this.featureOptionsKw.find((elem) => elem.featureId === each.featureId);
        if (feature) {
          feature.invisible = true;
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }


  updateKeywordVisibilityKw(featureId: string, visibility: boolean): void {
    this.featureOptionsKw
      .filter(each => each.featureId === featureId)
      .forEach(each => each.invisible = !visibility)
  }

  updateKeywordSubFeatureVisibilityKw(featureId: string, visibility: boolean): void {
    this.subFeatureOptionsKw
      .filter(each => each.featureId === featureId)
      .forEach(each => each.invisible = !visibility)
  }

  updateAllKeywordSubFeatureVisibilityKw(featureId: string, visibility: boolean,index): void {
    const subFeatures = this.KwSuFeaturesSubFeatures.find(item => item.featureId === featureId);
    if (subFeatures === undefined) {
      this.showKwSubFeatures = false;
    }
    else {
      this.allSubFeaturesKw = subFeatures.subFeatureIds;
      this.subFeatureOptionsKw = subFeatures.subFeatureIds;
    }
    if(this.kwFeaturesFormArray.at(index).get('subFeatureIds').value.length>0){
      this.subFeatureOptionsKw
        .forEach(each => each.invisible = !visibility)
    }
  }

  updateKeywordSubFeatureVisibilitySu(featureId: string, visibility: boolean): void {
    this.subFeatureOptionsSu
      .filter(each => each.featureId === featureId)
      .forEach(each => each.invisible = !visibility)
  }

  updateAllKeywordSubFeatureVisibilitySu(featureId: string, visibility: boolean,index): void {
    const subFeatures = this.KwSuFeaturesSubFeatures.find(item => item.featureId === featureId);
    if (subFeatures === undefined) {
      this.showSuSubFeatures = false;
    }
    else {
      this.allSubFeaturesSu = subFeatures.subFeatureIds;
      this.subFeatureOptionsSu = subFeatures.subFeatureIds;
      if (this.searchDataSuSubFeature.keyword) {
        this.subFeatureOptionsSu = this.searchSuFeaturesByName(this.searchDataSuSubFeature.keyword)
      }
    }
    if(this.suFeaturesFormArray.at(index).get('subFeatureIds').value.length>0){
      this.subFeatureOptionsSu
        .forEach(each => {
            each.invisible = !visibility
        })
    }
    console.log(this.subFeatureOptionsSu,"this is su sub");
    
  }

  async resolveFeatureOptionsSu(initial?: boolean) {
    try {
      const data = await this.customerService.getSuFeatures(this.searchDataSu).toPromise();

      if (!this.searchDataSu.keyword) {
        this.allFeaturesSu = data;
        this.showSelectedFeatureSu = true;
      }

      this.featureOptionsSu = data;
      this.featureOptionsSu.forEach((f) => (f.id = f.featureId));

      const listSelected = (this.customerForm.get('suAppDetails.features') as FormArray).value.map((obj: any) => obj);
      listSelected.forEach((each) => {
        const feature = this.featureOptionsSu.find((elem) => elem.featureId === each.featureId);
        if (feature) {
          feature.invisible = true;
        }
      });
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }


  async onFilterSu(value) {
    this.searchDataSu.keyword = value;
    await this.resolveFeatureOptionsSu()
  }

  selectKwSubFeatures(feature) {
    this.selectedKwMainFeatureId = feature.featureId;
    this.showKwSubFeatures = true;
    this.onFilterKwSubFeature('');
    this.isGenaieFeatureSelected(feature);
  }

  onFilterKwSubFeature(value) {
    this.searchDataKwSubFeature.keyword = value;
    const subFeatures = this.KwSuFeaturesSubFeatures.find(item => item.featureId === this.selectedKwMainFeatureId);
    if (subFeatures === undefined) {
      this.showKwSubFeatures = false;
    }
    else {
      this.allSubFeaturesKw = subFeatures.subFeatureIds;
      this.subFeatureOptionsKw = subFeatures.subFeatureIds;
      if (this.searchDataKwSubFeature.keyword) {
        this.subFeatureOptionsKw = this.searchKwFeaturesByName(this.searchDataKwSubFeature.keyword)
      }
      this.subFeatureOptionsKw.forEach(f => f.id = f.featureId)
      this.featureIndexKw = -1;
      for (let i = 0; i < this.kwFeaturesFormArray.length; i++) {
        const formGroup = this.kwFeaturesFormArray.at(i) as FormGroup;
        const featureId = formGroup.get('featureId').value;

        if (featureId === this.selectedKwMainFeatureId) {
          this.featureIndexKw = i;
          break;
        }
      }
    }
  }

  searchKwFeaturesByName(featureName: string): any[] {
    return this.subFeatureOptionsKw.filter((feature) =>
      feature.featureName.toLowerCase().includes(featureName.toLowerCase())
    );
  }

  searchSuFeaturesByName(featureName: string): any[] {
    return this.subFeatureOptionsSu.filter((feature) =>
      feature.featureName.toLowerCase().includes(featureName.toLowerCase())
    );
  }

  selectSuSubFeatures(feature) {
    this.selectedSuMainFeatureId = feature.featureId;
    this.showSuSubFeatures = true;
    this.onFilterSuSubFeature('');
  }

  onFilterSuSubFeature(value) {
    this.searchDataSuSubFeature.keyword = value;
    console.log(this.KwSuFeaturesSubFeatures,"this is kwsub feature");
    
    const subFeatures = this.KwSuFeaturesSubFeatures.find(item => item.featureId === this.selectedSuMainFeatureId);
    if (subFeatures === undefined) {
      this.showSuSubFeatures = false;
    }
    else {
      this.allSubFeaturesSu = subFeatures.subFeatureIds;
      this.subFeatureOptionsSu = subFeatures.subFeatureIds;
      if (this.searchDataSuSubFeature.keyword) {
        this.subFeatureOptionsSu = this.searchSuFeaturesByName(this.searchDataSuSubFeature.keyword)
      }
      this.subFeatureOptionsSu.forEach(f => f.id = f.featureId)
      this.featureIndexSu = -1;
      for (let i = 0; i < this.suFeaturesFormArray.length; i++) {
        const formGroup = this.suFeaturesFormArray.at(i) as FormGroup;
        const featureId = formGroup.get('featureId').value;

        if (featureId === this.selectedSuMainFeatureId) {
          this.featureIndexSu = i;
          break;
        }
      }
    }
  }

  removeSu(index, keyword) {
    console.log(keyword,"this is keyword",this.KwSuFeaturesSubFeatures);
    
    this.updateKeywordVisibilitySu(keyword.featureId, true);
    this.updateAllKeywordSubFeatureVisibilitySu(keyword.featureId, true,index);
    keyword.invisible = false;
    this.suFeaturesFormArray.removeAt(index);
    this.showSuSubFeatures = false;
  }

  updateKeywordVisibilitySu(featureId: string, visibility: boolean): void {
    this.featureOptionsSu
      .filter(each => each.featureId === featureId)
      .forEach(each => each.invisible = !visibility)
  }

  selectSu(option) {
    this.selectedSuMainFeatureId = option.featureId;
    option.invisible = true;
    this.addSuFeature();
    this.suFeaturesFormArray.at(this.suFeaturesFormArray.length - 1).get('featureId').patchValue(option.featureId)
    this.selectSuSubFeatures(option)
    if (this.showSuSubFeatures) {
      this.suFeaturesFormArray.at(this.suFeaturesFormArray.length - 1).get('subFeatureIds').addValidators(Validators.required)
    }
  }

  selectSuSubFeature(option) {
    option.invisible = true;
    this.addSuSubFeature(option);
  }

  get suFeaturesFormArray() {
    return this.customerForm.get('suAppDetails.features') as FormArray;
  }

  addSuFeature() {
    const feature = this.fb.group({
      featureId: [null],
      subFeatureIds: this.fb.array([]),
    });
    this.suFeaturesFormArray.push(feature);
  }

  addSuSubFeature(option) {
    const subFeatureFormArray = this.suFeaturesFormArray.at(this.featureIndexSu).get('subFeatureIds') as FormArray;
    subFeatureFormArray.push(
      this.fb.group({
        featureId: [option.featureId],
      })
    );
  }

  removeSuSubFeature(option, index) {
    this.updateKeywordSubFeatureVisibilitySu(option.featureId, true);
    option.invisible = false;
    const subFeatureFormArray = this.suFeaturesFormArray.at(this.featureIndexSu).get('subFeatureIds') as FormArray;
    subFeatureFormArray.removeAt(index);
  }

  handleEnterKeyPress(event) {
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== "textarea") {
      return false;
    }
    event.preventDefault();
    return true;
  }

  public findInvalidControls(formToInvestigate: FormGroup | FormArray) {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    }
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  isGenaieFeatureSelected(option) {
    if (option.featureId == 78) {
      this.isGenaieSelected = true;
      this.customerForm.get('clientDetails.noOfCourseGenerated').setValidators([Validators.required,Validators.max(5000), Validators.pattern(this.allIntegers)]);
      this.customerForm.get('clientDetails.noOfCourseApproved').setValidators([Validators.required,Validators.max(2500), Validators.pattern(this.allIntegers)]);
 
    } else {
      this.customerForm.get('clientDetails.noOfCourseGenerated').removeValidators([Validators.required,Validators.max(5000), Validators.pattern(this.allIntegers)]);
      this.customerForm.get('clientDetails.noOfCourseApproved').removeValidators([Validators.required,Validators.max(2500), Validators.pattern(this.allIntegers)]);
      this.isGenaieSelected = false;
    }
  }

}
