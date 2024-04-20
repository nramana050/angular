import { AppConfirmService } from '../../../framework/components/app-confirm/app-confirm.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentManagementSteps } from '../content.steps';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ContentManagementService } from '../content-management.service';
import { IKeyword } from '../content.interface';
import { debounceTime, tap } from 'rxjs/operators';
import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-edit-content-keywords',
  templateUrl: './edit-content-keywords.component.html',
  styleUrls: ['./edit-content-keywords.component.scss']
})
export class EditContentKeywordsComponent implements OnInit {

  public contentId: number;
  public contentForm: FormGroup;

  public keywordOptions: IKeyword[];
  public keywordFilterCtrl: FormControl = new FormControl();

  public size: number = 5000;
  public page: number = 0;

  public searchData = {
    keyword: ''
  };

  public mainCatList: any[];
  public subCatList: any[];
  profileUrl;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly contentSteps: ContentManagementSteps,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly contentService: ContentManagementService,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);

    if(this.profileUrl == 'rws-participant'){
      this.stepperNavigationService.stepper(this.contentSteps.stepsConfig2);
    }else{
      this.stepperNavigationService.stepper(this.contentSteps.stepsConfig);
    } 
   }

  ngOnInit() {
    this.resolveCategoryLists();
    this.initContentForm();
    this.keywordFilterCtrl.valueChanges
      .pipe(debounceTime(450))
      .subscribe(value => {
        this.onFilter(value);
      });
  }

  initContentForm() {
    this.contentForm = this.formBuilder.group({
      mainCategoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      keywordName: this.formBuilder.array([], [Validators.required, this.maxLengthArray(3)]),
    });

    this.route.queryParams.subscribe(params => {
      if (!params.id) {
        this.router.navigateByUrl('../');
      } else {
        this.contentId = +params.id;
        this.resolveKeywordOptions(this.page, this.size, this.searchData, true);
      }
    });
  }

  getKeywordForm(keyword: any) {
    return this.formBuilder.group({
      keywordName: new FormControl(keyword.keywordName),
      removable: new FormControl(keyword.removable)
    });
  }

  async getSelectedKeywords(id: number) {
    await this.contentService.getContentKeywords(id).toPromise()
      .then(data => {
        if (data) {
          if (data.nonExistingKeyword != null) {
           this.appConfirmService.confirm({
              message: '"' + data.nonExistingKeyword + '"' + ` keyword is no longer supported, please select new keyword`,
              showTextField: false,
              isRequired: false
            });
          }

          this.getSubcategory(data.mainCategoryId);
          this.contentForm.patchValue(data);
          const list = data.keywords ? data.keywords.split(',') : [];
          list.forEach((each: string) => {
            const keyword = {
              keywordName: each,
              removable: true
            };
            (this.contentForm.get('keywordName') as FormArray).push(this.getKeywordForm(keyword));
          });
        }
      });
  }

  async resolveKeywordOptions(page: number, size: number, body: any, initiate?: boolean) {
    if (initiate) {
      await this.getSelectedKeywords(this.contentId);
    }
    this.contentService.getContentKeywordOptions(page, size, body).toPromise()
      .then(data => {
        this.keywordOptions = data.content;
        const listSelected = (this.contentForm.get('keywordName') as FormArray).value.map((obj: IKeyword) => obj);
        listSelected.forEach(each => {
          const word = this.keywordOptions.find(elem => elem.keywordName === each.keywordName.trim());
          if (word) {
            word.invisible = true;
          }
        });
      });
  }

  select(option: any) {
    option.invisible = true;
    option.removable = true;
    (this.contentForm.get('keywordName') as FormArray).push(this.getKeywordForm(option));
    this.contentForm.get('keywordName').markAsTouched();
  }

  remove(index, keyword) {
    this.updateKeywordVisibility(keyword.keywordName, true);
    (this.contentForm.get('keywordName') as FormArray).removeAt(index);
    this.contentForm.get('keywordName').markAsTouched();
  }

  onKeyPress(keyCode, option) {
    if (keyCode === 13) {
      this.select(option);
    }
  }

  resolveCategoryLists() {
    this.subCatList = [];
    this.contentService.getMainCategories()
      .subscribe((data: any[]) => {
        this.mainCatList = data;
      });
  }

  getSubcategory(catId: number) {
    this.contentService.getSubcategory(catId)
      .subscribe((data: any[]) => {
        this.subCatList = data.map(each => {
          return {
            id: each.id,
            categoryTitle: each.categoryTitle,
          }
        });
      });
  }

  onMainCatChange(catId: number) {
    this.contentForm.get('subCategoryId').setValue('')
    this.getSubcategory(catId);
  }

  onFilter(value) {
    this.searchData.keyword = value;
    this.resolveKeywordOptions(this.page, this.size, this.searchData)
  }

  public saveAndNext() {
    const data = this.contentForm.getRawValue();
    data.contentId = this.contentId;
    data.keywordName = data.keywordName.map(obj => obj.keywordName).join(',');
    this.contentService.saveContentKeywordsAndCategory(data).subscribe(
      response => {
        if(this.profileUrl == 'rws-participant'){
          this.router.navigate(['/rws-content-management/image'], { queryParams: { id: response.responseObject.contentId } });
        } else{
          this.router.navigate(['/content-management/image'], { queryParams: { id: response.responseObject.contentId } });          this.snackBarService.success(response.message.applicationMessage);      

        }
      }, error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  updateKeywordVisibility(word: string, visibility: boolean): void {
    this.keywordOptions
      .filter(each => each.keywordName === word.toLowerCase())
      .forEach(each => each.invisible = !visibility)
  }

  linkCategories(value: string, index: number) {
    value = value.replace(/ /g, '');
    const formArr = (this.contentForm.get('keywordName') as FormArray);
    if (formArr.length < index + 1) {
      formArr.push(this.getKeywordForm({ keywordName: value.toLowerCase(), removable: false }));
    } else {
      const oldVal = formArr.value[index];
      this.updateKeywordVisibility(oldVal.keywordName.toLowerCase(), true);
      formArr.controls[index] = this.getKeywordForm({ keywordName: value.toLowerCase(), removable: false });
    }
    this.updateKeywordVisibility(value.toLowerCase(), false);
  }

  maxLengthArray(max: number) {
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value.length <= max) {
        return null;
      }
      return { 'maxLengthArray': { valid: false } };
    }
  }

}
