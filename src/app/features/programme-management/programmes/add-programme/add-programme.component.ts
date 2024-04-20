import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { Utility } from "../../../../framework/utils/utility";
import { CourseSetupService } from "../../../../features/admin/course-setup/course-setup.service";
import { ProviderSetupService } from "../../../../features/admin/provider-setup/provider-setup.service";
import { QualificationSetupService } from "../../../../features/admin/qualification-setup/qualification-setup.service";
import { RegexPattern } from "../../../../framework/constants/regex-constant";
import { SnackBarService } from "../../../../framework/service/snack-bar.service";
import { IProgrammes } from "../programmes.interface";
import { ProgrammesService } from "../programmes.service";

@Component({
  selector: "app-add-programme",
  templateUrl: "./add-programme.component.html",
  styleUrls: ["./add-programme.component.scss"],
})
export class AddProgrammeComponent implements OnInit {
  programmeForm: FormGroup;
  programmeNamePattern = RegexPattern.allCharPattern;
  capacityPattern = /^[1-9][0-9]*$/;
  programme: IProgrammes;
  formData;
  isDisable = true;
  filterBy = { keyword: null };
  isNew = true;
  sort = "asc";
  filteredCourses: Array<any> = [];
  filterQualification: Array<any> = [];
  providers: any = [];
  qualifications: any = [];
  AllListOfQualifications: any = [];
  allListOfCourse: Array<any> = [];
  cAndQIndex;
  pageSize = 10;
  showPagination = true;
  cErrorMessege = null;
  qErrorMessege = null;
  isLoaded = false;
  courseService: CourseSetupService;
  providerSetupService: ProviderSetupService;
  qualificationSetupService: QualificationSetupService;
  programmesService: ProgrammesService;
  isBreak = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly injector: Injector,
    private readonly snackBarService: SnackBarService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.courseService = this.injector.get(CourseSetupService);
    this.providerSetupService = this.injector.get(ProviderSetupService);
    this.qualificationSetupService = this.injector.get(QualificationSetupService);
    this.programmesService = this.injector.get(ProgrammesService);
    this.resolveRefData();
  }

  ngOnInit() {
    this.resolveProgramme();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  resolveRefData() {
    forkJoin([
      this.providerSetupService.getAllProviders(),
      this.courseService.getAllCourses(),
      this.qualificationSetupService.getAllQualification()

    ]).subscribe(data => {
      this.providers = data[0];
      this.allListOfCourse = data[1];
      this.AllListOfQualifications = data[2];
      this.isLoaded = true;

    })
  }

  resolveProgramme() {
    this.initProgrammeForm();
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.id) {
        this.isNew = false;
        setTimeout(() => {
          this.patchValueForUpdate(params.id)
        }, 200);
        
      }
    })
  }

  patchValueForUpdate(id) {

    this.programmesService.getProgrammeDetails(id).subscribe((resp) => {

      this.coursesAndQualificationsFormArray.removeAt(0);

      this.programmeForm.patchValue(resp);

      resp.coursesAndQualifications.forEach(element => {

        const course = Utility.getObjectFromArrayByKeyAndValue(this.allListOfCourse, 'id', element.courseId);

        let qualification = null;

        if (element.qualificationIds) {
          qualification = Utility.getObjectFromArrayByKeyAndValue(this.AllListOfQualifications, 'id', element.qualificationIds[0]);
        }

        element.courseName = course ? course.courseName : null;
        element.qualificationName = qualification ? qualification.qualificationName : null;

        this.coursesAndQualificationsFormArray.push(this.fb.group({
          courseName: element.courseName,
          courseId: element.courseId,
          qualificationIds: element.qualificationIds ? [element.qualificationIds[0]] : null,
          qualificationName: element.qualificationName
        }));
      });
      this.isDisable = false;
    })
  }

  get coursesAndQualificationsFormArray() {
    return this.programmeForm.controls["coursesAndQualifications"] as FormArray;
  }

  prevent(event) {
    event.preventDefault();
  }

  onDelete(cAndQIndex: number) {
    this.coursesAndQualificationsFormArray.removeAt(cAndQIndex);
    this.isDisable = this.coursesAndQualificationsFormArray.invalid;
    this.filterQualification = [];
    this.filteredCourses = [];
  }

  addCoursesAndQualifications() {
    const addCoursesAndQualificationsForm = this.fb.group({
      courseId: [null, [Validators.required]],
      courseName: [null, [Validators.required]],
      qualificationName: [null],
      qualificationIds: [null],
    });
    addCoursesAndQualificationsForm.get("qualificationName").disable();
    this.coursesAndQualificationsFormArray.push(
      addCoursesAndQualificationsForm
    );
    this.isDisable = true;
    this.filteredCourses = [];
    this.filterQualification = [];
  }

  initProgrammeForm() {
    this.programmeForm = this.fb.group({
      id: "",
      capacity: [null, [Validators.pattern(this.capacityPattern)]],
      programmeName: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(this.programmeNamePattern),
        ],
      ],
      providerId: [null, [Validators.required]],
      coursesAndQualifications: this.fb.array([
        this.fb.group({
          courseId: [null, [Validators.required]],
          courseName: [null, [Validators.required]],
          qualificationName: [null],
          qualificationIds: [null]
        }),
      ]),
    });

    if (
      this.coursesAndQualificationsFormArray.at(0).value.qualificationIds ===
      null
    ) {
      this.coursesAndQualificationsFormArray.controls[0]
        .get("qualificationName")
        .disable();
    }

    if (!this.isNew) {
      this.activatedRoute.params.subscribe();
    }
  }

  onChangeCapacity(event: any) {
    const capacity = event.target.value;
    if (capacity > 100) {
      this.programmeForm.controls.capacity.setErrors({ incorrect: true });
    }
  }

  onSubmit() {
    this.isNew ? this.createProgramme() : this.onUpdateProgramme();
  }

  onUpdateProgramme() {

    if (this.programmeForm.valid) {
      const payload = this.programmeForm.getRawValue();
      
      payload.coursesAndQualifications.forEach(course => {
        if (course.qualificationIds && !Array.isArray(course.qualificationIds)) {
          course.qualificationIds = [course.qualificationIds];
        }
      });
      this.programmesService.updateProgramme(payload).subscribe((resp) => {
        this.router.navigate(["programme-management/programmes"]);
        this.snackBarService.success(resp.message.applicationMessage);
      },
        (error) => {
          this.snackBarService.error(error.error.applicationMessage);
        }
      )
    }
  }

  createProgramme() {
    const payload = this.programmeForm.getRawValue();
    this.programmesService.createProgramme(payload).subscribe(
      (resp) => {
        this.router.navigate(["programme-management/programmes"]);
        this.snackBarService.success(resp.message.applicationMessage);
      },
      (error) => {
        this.snackBarService.error(error.error.applicationMessage);
      }
    );
  }

  onFilter(filterValue: string, index) {
    this.coursesAndQualificationsFormArray.controls[index].patchValue({
      courseId: null,
    });
    this.showPagination = true;
    this.cAndQIndex = index;
    this.filterBy = { keyword: filterValue };
    this.paginator.pageIndex = 0;
    this.resolveCourses(this.paginator.pageIndex);
    this.filterQualification = [];
  }

  onFilterKeyupCourse(filterValue: string, index) {
    this.cAndQIndex = index;
    if (filterValue === null || filterValue === '') {
      this.onFilter(filterValue, index);
      this.coursesAndQualificationsFormArray.at(this.cAndQIndex).get('courseName').setErrors({ required: true });
    }
    else if (this.isDublicate(filterValue)) {
      this.coursesAndQualificationsFormArray.at(this.cAndQIndex).get('courseName').setErrors({ dublicate: true });
    }
    if (this.coursesAndQualificationsFormArray.at(this.cAndQIndex).get('courseName').invalid) {
      this.isDisable = true;
      this.coursesAndQualificationsFormArray.controls[this.cAndQIndex]
        .get("qualificationName")
        .reset();
        this.coursesAndQualificationsFormArray.controls[this.cAndQIndex]
        .get("qualificationIds")
        .reset();
      this.coursesAndQualificationsFormArray.controls[this.cAndQIndex]
        .get("qualificationName")
        .disable();
    }
  }
 
  onFilterKeyupQualification(filterValue: string, index) {
    this.cAndQIndex = index;

    if (filterValue === null || filterValue === "") {
      this.isDisable = false;
      this.coursesAndQualificationsFormArray.controls[this.cAndQIndex].patchValue({
        qualificationName: null
      });
      this.coursesAndQualificationsFormArray.controls[this.cAndQIndex].patchValue({
        qualificationIds: null
      });
    }

    else if (filterValue !== null || filterValue !== "") {

      this.isValidQualification(filterValue);

      if (!this.isBreak) {
        this.coursesAndQualificationsFormArray.controls[this.cAndQIndex]
          .get("qualificationName")
          .setErrors({ incorrect: true });
        this.isDisable = true
      }
      
    }
  }

  isValidQualification(filterValue) {

    for (let i = 0; i < this.AllListOfQualifications.length; i++) {
      this.isBreak = false;

      if (this.AllListOfQualifications[i].qualificationName === filterValue) {

        this.checkDublicateQualification(filterValue);

        if (!this.isBreak) {
          this.coursesAndQualificationsFormArray.controls[
            this.cAndQIndex
          ].patchValue({
            qualificationName: this.AllListOfQualifications[i].qualificationName,
            qualificationIds: [this.AllListOfQualifications[i].id]
          });
          this.isBreak = true;
          this.isDisable = false;
          break;
        }
      }

      if (this.isBreak) {
        this.isBreak = true;
        break;
      }
    }
  }

  checkDublicateQualification(filterValue) {

    for (let j = 0; j < this.coursesAndQualificationsFormArray.length; j++) {

      if (filterValue === this.coursesAndQualificationsFormArray.at(j).get('qualificationName').value && j !== this.cAndQIndex) {
        this.coursesAndQualificationsFormArray.controls[this.cAndQIndex]
          .get("qualificationName").setErrors({ duplicateQualification: true });
        this.isBreak = true;
        this.isDisable = true;
      }

    }

  }

  onFilterQualification(filterValue: string, index) {
    this.coursesAndQualificationsFormArray.controls[index].patchValue({
      qualificationIds: null
    });
    this.showPagination = false;
    this.cAndQIndex = index;
    this.filterBy = { keyword: filterValue };
    this.paginator.pageIndex = 0;
    this.resolveQualification(this.paginator.pageIndex);
    this.filteredCourses = [];
  }

  resolveQualification(pageIndex) {
    this.qualificationSetupService
      .findAllPaginated(this.sort, pageIndex, this.pageSize, this.filterBy)
      .subscribe(
        (data: any) => {
          if (data.length !== 0) {
            this.filterQualification = data.content
          }
          else {
            this.filterQualification = []
          }
          this.paginator.length = data.totalElements;
        },
        (error) => {
          this.snackBarService.error(error.error.errorMessage);
        }
      );
  }

  resolveCourses(pageIndex) {
    this.courseService
      .findAllPaginated(this.sort, pageIndex, this.pageSize, this.filterBy)
      .subscribe(
        (data: any) => {
          if (data.length !== 0) {
            this.filteredCourses = data.content
          }
          else {
            this.filteredCourses = []
          }
          this.paginator.length = data.totalElements;
        },
        (error) => {
          this.snackBarService.error(error.error.errorMessage);
        }
      );
  }

  onPaginateChange() {
    if (this.filteredCourses.length > 0) {
      this.resolveCourses(this.paginator.pageIndex);
    }
    if (this.filterQualification.length > 0) {
      this.resolveQualification(this.paginator.pageIndex);
    }
  }

  onSelectedCourse(value) {

    if (value.id !== null && !this.isDublicate(value)) {
      this.isDisable = false;
      this.coursesAndQualificationsFormArray.controls[
        this.cAndQIndex
      ].patchValue({
        courseName: value.courseName,
        courseId: value.id,
      });
      this.filteredCourses = [];
      this.coursesAndQualificationsFormArray.controls[this.cAndQIndex]
        .get("qualificationName")
        .enable();
      this.coursesAndQualificationsFormArray.controls[this.cAndQIndex]
        .get("qualificationName")
        .reset();
      this.coursesAndQualificationsFormArray.controls[this.cAndQIndex]
        .get("qualificationIds")
        .reset();
    } else {
      this.coursesAndQualificationsFormArray.at(this.cAndQIndex).get('courseName').setErrors({ dublicate: true });
    }
    this.filteredCourses = [];
  }

  isDublicate(value) {
    for (let i = 0; i < this.coursesAndQualificationsFormArray.length; i++) {
      const courseName =
        this.coursesAndQualificationsFormArray.at(i).value.courseName;
      if ((courseName === value.courseName || courseName === value) && i !== this.cAndQIndex) {
        return true;
      }
    }
  }

  onSelectedQualification(value) {
    this.isValidQualification(value.qualificationName);
    this.isDisable = false;
    this.filterQualification = [];
  }

  handleEnterKeyPress(event) {
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== "textarea") {
      return false;
    }
    event.preventDefault();
    return true;
  }

}
