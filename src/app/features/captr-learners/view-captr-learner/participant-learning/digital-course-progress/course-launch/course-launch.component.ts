import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseUrl } from 'src/app/framework/constants/url-constants';
import { MainService } from 'src/app/framework/service/main.service';
import { DigitalCourseProgressService } from '../digital-course-progress.service';
import { Location } from '@angular/common';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-course-launch',
  templateUrl: './course-launch.component.html',
  styleUrls: ['./course-launch.component.scss']
})
export class CourseLaunchComponent implements OnInit {

  private readonly courseId: number;
  url: any;
  flag: boolean = true;
  courseName: string;
  subscription: Subscription;
  profileUrl: any;

  constructor(
    private readonly mainService: MainService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly router: Router,
    private readonly digitalCourseService: DigitalCourseProgressService,
  ) {
    this.courseId = +this.route.snapshot.paramMap.get('courseId');
    this.url = `${BaseUrl.MOODLE_URL}course/view.php?id=` + this.courseId;
    this.mainService.pageTitle = ' ';
    this.courseName = decodeURIComponent(window.location.href.split("=")[1]);
  }
  
  ngOnInit() {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    const isloggedin = localStorage.getItem('isloggedin');
    if (isloggedin !== 'false') {
      localStorage.setItem('isloggedin', 'false');
    } else {
      const x = document.getElementById("iframediv");
      x.style.display = 'none';
      this.digitalCourseService.moodleLogin().subscribe(data => {

        const loginurl = data['loginurl'] + '&wantsurl=' +
          location.origin + `/${this.profileUrl}/digital-course-progress/courseLaunch/` + this.courseId + `?coursename=${this.courseName}`;
          console.log(this.profileUrl);
          window.location.href = loginurl;
        localStorage.setItem('isloggedin', 'true');
        this.flag = false;
      });
    }
  }

  ngOnDestroy() {
    this.mainService.pageMainTitle = '';
    if (this.flag) {
      localStorage.setItem('isloggedin', 'false');
    }
  }

  backClicked() {
    this.location.back();
  }
}