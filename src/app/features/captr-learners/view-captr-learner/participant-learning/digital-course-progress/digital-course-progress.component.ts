import { Component, OnInit, ViewChild } from '@angular/core';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DigitalCourseProgressService } from './digital-course-progress.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { SessionsService } from 'src/app/sessions/sessions.service';
import { map } from 'rxjs/operators';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-digital-course-progress',
  templateUrl: './digital-course-progress.component.html',
  styleUrls: ['./digital-course-progress.component.scss']
})
export class DigitalCourseProgressComponent implements OnInit {

  userId: any;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['fullName', 'enrolmentDate', 'progress', 'status']
  sortColumn = 'fullName';
  sortDirection = 'asc';
  pageSize = 10;
  filterBy = { 'keyword': '' };
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  name: any;
  selectStatus: any = 'allCourses';
  profileUrl;
  progressFeild='Participant progress:';

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    private readonly digitalCourseService: DigitalCourseProgressService,
    private readonly router: Router,
    private readonly sessionService: SessionsService,
    private readonly appConfirmService: AppConfirmService,
    private readonly snackBarService: SnackBarService,
  ) {
      this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
      this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);  
      this.setTitle();

      if(this.profileUrl === 'clink-learners'){
        this.progressFeild='Graduate progress';
      }

    if (this.isAuthorized(86, 2)) {
      this.displayedColumns.push('actions');
    }
  }
  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.name}`;
    });
  }
  

  ngOnInit(): void {

    this.resolveCourses(this.filterBy);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      this.resolveCourses(this.filterBy);
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveCourses(this.filterBy);
        })
      )
      .subscribe();
  }

  resolveCourses(filterBy) {
    let currentPageIndex = 0;
    if (this.paginator) {
      currentPageIndex = this.paginator.pageIndex + 1;
    }

    let payload = {
      page: currentPageIndex,
      pagesize: this.pageSize,
      sort: this.sortColumn + " " + this.sortDirection,
      userId: this.userId,
      search: filterBy.keyword
    };

    if (this.selectStatus !== 'allCourses') {
      payload['statusFilter'] = this.selectStatus
    }

    this.digitalCourseService.getEnrolledCourses(payload).pipe(
      map(data => {
        data.course.forEach(course => {
          course.enrollmentdate = new Date(course.enrollmentdate * 1000).toString();
          if (course.progress != 0) {
            course.progress = course.progress.toFixed(0);
          }
        })
        return data;

      })).subscribe(data => {

        this.dataSource = data.course
        this.paginator.length = data.totalpages;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
  }

  onFilter(filterString: string) {
    this.selectStatus = 'allCourses'
    this.filterBy.keyword = filterString;
    this.paginator.pageIndex = 0;
    this.resolveCourses(this.filterBy);
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  onExitClicked() {
      this.router.navigate([this.profileUrl+'/participant-professional-view'], { queryParams: { id: this.userId, name: this.name}});
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }

  onStatusChange() {
    document.getElementById("search_service_user_input")['value'] = '';
    this.filterBy.keyword = '';
    this.paginator.pageIndex = 0;
    this.resolveCourses(this.filterBy)
  }

  courseLaunch(id, fullname) {
    this.digitalCourseService.moodleLogin().subscribe(data => {
      sessionStorage.setItem('courseName', fullname.toString());
      const loginurl = data['loginurl'] + '&wantsurl=' +
        location.origin + `/${this.profileUrl}/digital-course-progress/courseLaunch/` + id + `?coursename=${fullname.toString()}`;
      console.log(loginurl);
      window.location.href = loginurl;
      localStorage.setItem('isloggedin', 'true');
    })
  }
  
  onUnenroll(courseId, courseName) {

    const payload = {
      courseId: courseId,
      serviceUserId: this.userId
    }
    const dialogRef = this.appConfirmService.confirm({
      title: `Unenroll`,
      message: `Are you sure you want to unenroll ${this.name} from ${courseName} ?`
    });
    dialogRef.subscribe(result => {
      if (result) {
        this.digitalCourseService.unenrollUser(payload).subscribe(Response => {
          this.paginator.pageIndex = 0;
          this.resolveCourses(this.filterBy)
          this.snackBarService.success("User unenroll successfully");
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        });
      }
    });
  }

  goToDigitalCourse(){ 
      this.router.navigate([this.profileUrl+'/digital-course-progress'], { queryParams: { id: this.userId, name: this.name}});
  }

  goToProgramInfo(){
    this.router.navigate([this.profileUrl+'/digital-course-progress/programme-enrolment'], { queryParams: { id: this.userId, name: this.name}});
  }
  goToProgramOutcome(){
    this.router.navigate([this.profileUrl+'/digital-course-progress/programme-outcomes'], { queryParams: { id: this.userId, name: this.name}});
  }
}
