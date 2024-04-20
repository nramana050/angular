import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DigitalCoursesService } from './digital-courses.service';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-digital-courses',
  templateUrl: './digital-courses.component.html',
  styleUrls: ['./digital-courses.component.scss']
})
export class DigitalCoursesComponent implements OnInit {

  displayedColumns: string[] = ['course', 'enrolledCount', 'actions'];
  dataSource = new MatTableDataSource();
  pageSize: number = 10;
  sortColumn: string = 'id';
  filterBy = { 'keyword': '' };
  profileUrl;
  currentlyEnrolled='Participants currently enrolled';
  enrollmentLabel='Enroll participant';
  unerollmentLabel='Unenroll participant';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private readonly digitalCoursesService: DigitalCoursesService,
    private readonly router: Router,
  ) { 
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    
    if(this.profileUrl === 'clink-learners'){
      this.currentlyEnrolled='Graduates currently enrolled';
      this.enrollmentLabel='Enroll graduate';
      this.unerollmentLabel='Unenroll graduate';

    }
   


  }

  ngOnInit(): void {
    this.resolveCourses(this.filterBy)
  }

  ngAfterViewInit() {
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

    const payload = {
      page: currentPageIndex,
      pagesize: this.pageSize,
      sort: "fullname",
      search: filterBy.keyword
    };

    this.digitalCoursesService.getCourseslist(payload).subscribe((data: any) => {
      this.dataSource = data.course
      this.paginator.length = data.totalpages;
      this.dataSource.paginator = this.paginator;
    });
  }

  onFilter(filterString: string) {
    this.filterBy.keyword = filterString;
    this.paginator.pageIndex = 0;
    this.resolveCourses(this.filterBy);
  }

  courseLaunch(id, fullname) {
    this.digitalCoursesService.moodleLogin().subscribe(data => {
      sessionStorage.setItem('courseName', fullname.toString());
      console.log(this.profileUrl);
      const loginurl = data['loginurl'] + '&wantsurl=' +
        location.origin + '/digital-courses/courseLaunch/' + id + `?coursename=${fullname.toString()}`;
      window.location.href = loginurl;
      localStorage.setItem('isloggedin', 'true');
    });
  }
  
  enrolLearner(id) {
    this.router.navigate(['/digital-courses/enroll-learner'],
          { queryParamsHandling: 'merge', queryParams: { courseId : id,  enrolmentStatus : 'unenrolled'} });
  }

  unenrolLearner(id) {
    this.router.navigate(['/digital-courses/enroll-learner'],
          { queryParamsHandling: 'merge', queryParams: { courseId : id,  enrolmentStatus : 'enrolled'} });
  }
}
