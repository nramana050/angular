import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/operators';
import { MatSelectionList } from '@angular/material/list';
import { DigitalCoursesService } from '../digital-courses.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-enroll-learner',
  templateUrl: './enroll-learner.component.html',
  styleUrls: ['./enroll-learner.component.scss']
})
export class EnrollLearnerComponent implements OnInit {
  collapsible: boolean;
  isallLearnersEnrolled: boolean = true;
  courseId: number;
  courseName: string;
  selectAll: boolean;
  orgNameFilter = new FormControl();
  serviceUsers: any
  filteredAndPagedServiceUsers: Array<any>;
  enrolParticipantForm: FormGroup;
  usedIds: Array<any> = [];
  unCheckedUserIds: Array<any> = [];
  public serviceUsersMultiCtrl: FormControl = new FormControl();
  public publishToAllCtrl: FormControl = new FormControl();
  publishToAll = false;
  update: EventEmitter<any> = new EventEmitter();
  enrolmentStatus;
  profileUrl;
  participantEnrolled='Participant enrolled successfully';
  participantsEnrolled='Participants enrolled successfully';
  graduateUnenrolled='Participant unenrolled successfully';
  graduatesUnenrolled='Participants unenrolled successfully';

  enrollmentSectionLabel='Enroll participant';
  unerollmentSectionLabel='Unenroll participant';

  @ViewChild('orgSection') orgSection: MatSelectionList;
  constructor(public readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly digitalCoursesService: DigitalCoursesService,
    private readonly snack: SnackBarService,
    private readonly appConfirmService: AppConfirmService) {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    
      if(this.profileUrl === 'clink-learners'){
        this.participantEnrolled='Graduate enrolled successfully';
        this.participantsEnrolled='Graduates enrolled successfully';
        this.graduateUnenrolled='Graduate unenrolled successfully';
        this.graduatesUnenrolled='Graduates unenrolled successfully';

        this.enrollmentSectionLabel='Enroll graduates';
        this.unerollmentSectionLabel='Unenroll graduates';

      }
    // this.courseId = this.route.snapshot.params.courseId;
    // this.enrolmentStatus = this.route.snapshot.params.enrolmentStatus;
    // this.courseName = this.route.snapshot.params.fullname;
    // this.route.snapshot.data['title'] = `Assign ${this.courseName}`;
  }

  ngOnInit() {

    this.route.queryParams.subscribe((params: any) => {
      this.courseId = params.courseId
      this.enrolmentStatus = params.enrolmentStatus
    });

    this.initEnrollLearnersForm(this.courseId);

    this.resolveLearners(this.courseId);
    this.orgNameFilter.valueChanges.pipe(
      debounceTime(450),
    ).subscribe(value => {
      this.filteredAndPagedServiceUsers = this.serviceUsers
        .filter(element => (element.firstname + ' ' + element.lastname).toLowerCase().indexOf(value.toLowerCase()) > -1);
    });
  }
  initEnrollLearnersForm(courseId) {

    this.createPublishAssessmentForm(this.courseId);
  }
  createPublishAssessmentForm(courseId) {
    this.enrolParticipantForm = this.formBuilder.group({
      courseId: courseId,
      userIds: []
    });
  }
  resolveLearners(courseId) {
    this.digitalCoursesService.getUsersByCourse(courseId, this.enrolmentStatus).subscribe(
      data => {
        this.serviceUsers = data.users;
        this.serviceUsers.forEach(element => {
          this.unCheckedUserIds.push(element);
          this.isallLearnersEnrolled = false;
        });
        this.filteredAndPagedServiceUsers = this.serviceUsers;
      },
      error => {
        this.snack.error(`${error.error.errorMessage}`);
        this.navigateHome();
      }
    );
  }

  onSubmit() {

    this.orgSection.selectedOptions.selected.forEach(org => {
      this.usedIds.push(org.value);
    });

    if (this.usedIds.length === 0) {
      this.snack.error('Select at least one user or Select All');
    } else {
      this.enrolParticipantForm.controls.userIds.patchValue(this.usedIds);
      if (this.enrolmentStatus === 'unenrolled') {
        this.digitalCoursesService.enrollUsers(this.enrolParticipantForm.value).subscribe(
          (data: any) => {
            if (this.usedIds.length <= 1) {
              this.snack.success(this.participantEnrolled);
            }
            else {
              this.snack.success(this.participantsEnrolled);
            }
            this.navigateHome();
          },
          (error: any) => {
            this.snack.error(error.errorMessage);
            this.navigateHome();
          }
        );
      }
      else if (this.enrolmentStatus === 'enrolled') {

        const dialogRef = this.appConfirmService.confirm({
          title: `Unenroll`,
          message: `You are unenrolling the user/s from the Moodle course. Once unenrolled, the user will lose access to the course content.`,
          okButtonLabel: 'Confirm'
        });

        dialogRef.subscribe(result => {
          if (result) {
            this.digitalCoursesService.unenrollUsers(this.enrolParticipantForm.value).subscribe(
              (data: any) => {
                if (this.usedIds.length <= 1) {
                  this.snack.success(this.graduateUnenrolled);
                }
                else {
                  this.snack.success(this.graduatesUnenrolled);
                }
                this.navigateHome();
              },
              (error: any) => {
                this.snack.error(error.errorMessage);
                this.navigateHome();
              }
            );
          }
        })
      }
    }
  }

  navigateHome() {
    this.router.navigateByUrl('/digital-courses');
  }
  public toggleSelectAll() {
    this.unCheckedUserIds.forEach(usr => {
      usr.checked = this.selectAll;
      this.publishToAll = this.selectAll;
    });
  }

  public toggleCheckedOption(user) {
    this.serviceUsers.forEach(org => {
      if (org.id === user.id) {
        org.enrol = user.enrol;
      }
    })
  }

  public onSelectedOptionsChange() {
    setTimeout(() => {
      const listSelected = [];
      this.serviceUsers.filter(org => {
        return org.enrol;
      }).forEach(chosen => {
        // listSelected.push(chosen);
      });
      this.update.emit(listSelected);
      this.updateSelectAllState();
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
