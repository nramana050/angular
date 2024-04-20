import { SnackBarService } from '../../../framework/service/snack-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IAuthorNameList } from './iauthor-name-list';
import { ContentManagementService } from './../content-management.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ContentManagementSteps } from '../content.steps';
import { StepperNavigationService } from '../../shared/components/stepper-navigation/stepper-navigation.service';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../framework/components/date-adapter/date-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from'@angular/material-moment-adapter';
import { Utility } from '../../../framework/utils/utility';



@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class EditContentComponent implements OnInit {

  private contentId: number;
  manageContentForm: FormGroup;
  isNew = false;
  learningStyleNameList: any[];
  authorNameList: IAuthorNameList[] = [];
  filteredAuthorNameList: Observable<IAuthorNameList[]>;

  minStartDate: Date;
  minEndDate: Date;
  data;

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackBarService: SnackBarService,
    private readonly contentManagementService: ContentManagementService,
    private readonly contentSteps: ContentManagementSteps,
    private readonly stepperNavigationService: StepperNavigationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.stepperNavigationService.stepper(this.contentSteps.stepsConfig);
    this.minStartDate = new Date();
    this.minEndDate = new Date();
    this.minEndDate.setDate(this.minStartDate.getDate() + 1);
  }

  ngOnInit() {
    this.initContentForm();
    this.getLearningStyleList();
    this.contentManagementService.getAllAuthorList().subscribe(
      authorList => {
        this.authorNameList = authorList;
        return this.authorNameList;
      });
    this.filteredAuthorNameList = this.manageContentForm.controls.author.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): IAuthorNameList[] {
    if(!value) {
      return this.authorNameList;;
    }
    const filterValue = value.toLowerCase(); 
    return this.authorNameList.filter((option: any) => option.authorName.toLowerCase().includes(filterValue));
  }

  initContentForm() {
    this.manageContentForm = this.fb.group({
      contentId: [''],
      title: ['', [Validators.required, Validators.pattern("([A-Za-z0-9\s\!\ \'\.\,\-\/]+)")]],
      author: ['',[Validators.pattern('\\s*([A-Za-z\\s]+)*\\s*')]],
      learningStyleIds: ['', Validators.required],
      description: ['', Validators.required],
      curationStartDate: ['', Validators.required],
      curationEndDate: ['']
    })

    this.manageContentForm.get('curationStartDate').valueChanges
      .subscribe(date => {
        if (date) {
          this.setCurationDateConstraints(new Date(date));
        }
      });

    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.contentId = params.id;
        this.resolveUploadStepNavigation();
        this.contentManagementService.getContentDetails(params.id).subscribe(data => {
          this.isNew = false;
          this.manageContentForm.patchValue(data);
          if(data.curationStartDate) {
            this.manageContentForm.get('curationStartDate').setValue(new Date(data.curationStartDate));
          }
          if(data.curationEndDate) {
            this.manageContentForm.get('curationEndDate').setValue(new Date(data.curationEndDate));
          }
          this.manageContentForm.get('curationStartDate').disable();
          this.setCurationDateConstraints(new Date(data.curationStartDate));
        });
      } else {
        this.isNew = true;
      }
    });
  }
  resolveUploadStepNavigation() {
    const contentUploadURL: any = '/content-management/upload';
    this.contentManagementService.getContent(this.contentId).subscribe(data => {
      if (data.modules.length > 0) {
        const moduleId = data.modules[0].id;
         if(data.modules[0].type === "URL") {
          const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig, 'id', 'U');
          uploadStep.state = contentUploadURL + '/external/view';
          uploadStep.queryParams = {moduleId: moduleId};
         } else {
          const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig, 'id', 'U');
          uploadStep.state = contentUploadURL + '/internal';
         }
      } else {
        const uploadStep = Utility.getObjectFromArrayByKeyAndValue(this.contentSteps.stepsConfig, 'id', 'U');
        uploadStep.state = contentUploadURL;
        uploadStep.queryParams = {moduleId: null};
      }
    });
  }

  getLearningStyleList() {
    this.contentManagementService.getLearningStyleList().subscribe(
      learningStyleList => {
        this.learningStyleNameList = learningStyleList;
      });
  }
  onSubmit(data) {
    if (this.isNew) {
      this.createNewContent(data);
    } else {
      this.editContent(data)
    }
  }

  createNewContent(form: FormGroup) {
    this.data = form.getRawValue();
    this.data.curationStartDate = Utility.transformDateToString(this.data.curationStartDate);
    this.data.curationEndDate = Utility.transformDateToString(this.data.curationEndDate);
    this.contentManagementService.postNewContent(this.data).subscribe(
      response => {
        this.router.navigate(['/content-management/establishment'], { queryParams: { id: response.responseObject.contentId } });
        this.snackBarService.success(response.message.applicationMessage);
      }, error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      });
  }

  editContent(form: FormGroup) {
    this.data = form.getRawValue();
    this.data.curationStartDate = Utility.transformDateToString(this.data.curationStartDate);
    this.data.curationEndDate = Utility.transformDateToString(this.data.curationEndDate);
    this.contentManagementService.updateContentDescription(this.data).subscribe(
      response => {
        this.router.navigate(['/content-management/establishment'], { queryParams: { id: response.responseObject.contentId } });
        this.snackBarService.success(response.message.applicationMessage);
      },
      error => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      }
    )
  }

  setCurationDateConstraints(date?: Date) {
    if(this.isNew) {
      this.minEndDate = new Date(date);
      this.minEndDate.setDate(date.getDate() + 1);
    } else {
      this.minStartDate = new Date(date);
      this.minEndDate = new Date(this.minStartDate);
      this.minEndDate.setDate(date.getDate() + 1);
    }
  }

}
