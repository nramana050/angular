import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { AssessmentService } from '../assessment.service';
import { IPublishAssessment } from "./publish-assessment.interface";
import { debounceTime } from 'rxjs/operators';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';

@Component({
  selector: 'app-publish-assessment',
  templateUrl: './publish-assessment.component.html',
  styleUrls: ['./publish-assessment.component.scss']
})

export class PublishAssessmentComponent implements OnInit {
  collapsible: boolean;
  assessmentTemplateId: number;
  assessmentName: string;
  selectAll: boolean;
  serviceUsers: Array<IPublishAssessment>;
  suNameFilter = new FormControl();
  filteredAndPagedServiceUsers: Array<any>;
  publishAssessmentForm: FormGroup;
  usedIds: Array<any> = [];
  public serviceUsersMultiCtrl: FormControl = new FormControl();
  public publishToAllCtrl: FormControl = new FormControl();
  publishToAll = false;
  update: EventEmitter<any> = new EventEmitter();
  @ViewChild('orgSection', {static:false}) orgSection: MatSelectionList;
  constructor(
    public readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly _assessmentService: AssessmentService,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      if (params.assessmentName) {
        this.assessmentName = params.assessmentName;
      }
    });
    this.route.snapshot.data['title'] = `Assign ${this.assessmentName}`;
  }

  ngOnInit() {

    this.initPublishAssessmentForm();
    this.resolveServiceUsers();
    
    this.suNameFilter.valueChanges.pipe(
      debounceTime(450),
    ).subscribe(value => {
      this.filterUsers();
    });
  }


  navigateHome() {
    this.router.navigateByUrl('/assessment-builder');
  }

  initPublishAssessmentForm() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.assessmentTemplateId) {
        this.assessmentTemplateId = params.assessmentTemplateId;
      }
    });
    this.createPublishAssessmentForm(this.assessmentTemplateId);
  }

  createPublishAssessmentForm(templateId) {
    this.publishAssessmentForm = this.formBuilder.group({
      assessmentTemplateId: templateId,
      userIds: []
    });
  }

  resolveServiceUsers() {
      this._assessmentService.getServiceUsers('SU').subscribe(
        (data: any[]) => {
          this.serviceUsers = data;
          this.filteredAndPagedServiceUsers = this.serviceUsers;
        },
        error => {
          this.snackBarService.success(`${error.error.applicationMessage}`);
          this.navigateHome();
        }
      );
  }

  filterUsers() {
    const suNameFilter = this.suNameFilter.value;
    let tempFiltered = [];
    this.filteredAndPagedServiceUsers = [];
    if (!suNameFilter) {
      this.filteredAndPagedServiceUsers.push(...this.serviceUsers);
      this.updateSelectAllState();
      return;
    }
    tempFiltered = this.serviceUsers.filter(option => {
      let suNameCheck = false;
      suNameCheck = suNameFilter ? option.fullName.toLowerCase().includes(suNameFilter.toLowerCase()) : true;
      return suNameCheck;
    });
    if (tempFiltered.length > 0) {
      this.filteredAndPagedServiceUsers.push(...tempFiltered);
    }
    this.updateSelectAllState();
  }

  onSubmit(publishAssessmentForm) {

    this.serviceUsers.filter(element => element.checked).forEach(serviceUser => {
      this.usedIds.push(serviceUser.id)
    });
    if (this.usedIds.length === 0) {
        this.snackBarService.error('Select at least one user or Select All');
    } else {
      this.publishAssessmentForm.controls.userIds.patchValue(this.usedIds);
      this._assessmentService.publishedAssessment(publishAssessmentForm.value).subscribe(
        (data: any) => {
          this.snackBarService.success('Asset Template Assigned!');
          this.navigateHome();
        },
        (error: any) => {
          this.snackBarService.error(error.errorMessage);
          this.navigateHome();
        }
      );
    }
  }

  public toggleSelectAll(organization: IPublishAssessment) {
    this.filteredAndPagedServiceUsers.forEach(usr => {
      usr.checked = this.selectAll;
      this.publishToAll = this.selectAll;
     
    });
  }

  public toggleCheckedOption(user: IPublishAssessment) {
    user.checked = !user.checked;
      this.serviceUsers.forEach(org => {
        if(org.id === user.id) {
          org.checked = user.checked;
        }
      })
  }

  private updateSelectAllState() {
    if (this.filteredAndPagedServiceUsers.length === 0) {
      this.selectAll = false;
      return;
    }
    const notSelected = this.filteredAndPagedServiceUsers.filter(elem => !elem.checked);
    if (notSelected.length > 0) {
      this.selectAll = false;
      return;
    } else {
      this.selectAll = true;
      return;
    }
  }
}
