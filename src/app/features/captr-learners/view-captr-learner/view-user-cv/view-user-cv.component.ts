import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {  MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LearnerNavigation } from '../learner-nav';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';
import { ParticipantNavigation } from 'src/app/features/participant-v2/view-participant/participant-nav';

@Component({
  selector: 'app-view-user-cv',
  templateUrl: './view-user-cv.component.html',
  styleUrls: ['./view-user-cv.component.scss']
})
export class ViewUserCvComponent implements OnInit {

  fname: string;
  lname: string;
  prn: string;
  allCVDetails: any;
  id: any;
  dataSource = new MatTableDataSource<any>();
  profileUrl;

  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  constructor(
    private readonly inPageNavService: InPageNavService ,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    private readonly learnersService: LearnersService,
    private readonly snack: MatSnackBar,
    private readonly router: Router,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
     this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
       this.setTitle();
  }

 setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.name) {
        this.fname = params.name;
        this.id = params.id;
      }
      this.route.snapshot.data.title = `${this.fname}`;
    });
  }

  ngOnInit() {
    this.getAllAssessments(this.id);
  }


  getAllAssessments(suID) {
    this.learnersService.getCVDetails(suID).subscribe(
      response => {
        console.log(response);
        
        this.dataSource.data = response;
        this.paginator.length = response.length;
        this.dataSource.paginator = this.paginator;

      },
      error => this.snack.open(error.errorMessage, 'Dismiss', { duration: 4000 })
    );
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  download(id) {
    this.learnersService.download(id).subscribe(res => {
      console.log("done");
    });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }
}
