import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { IUser } from 'src/app/features/manage-users/user.interface';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-case-note-v2',
  templateUrl: './case-note-v2.component.html',
  styleUrls: ['./case-note-v2.component.scss']
})
export class CaseNoteV2Component implements OnInit {

  userId: string;
  name: string;
  SU: string = 'SU';
  caseNote : boolean;
  sortColumn = 'name';
  sortDirection = 'asc';
  profileUrl;
  pageSize = 10;
  dataSource = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  filterBy = { 'keyword': '' , 'refUserType':'SF' };

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly pageNav: InPageNavService,
    private readonly learnerNav: LearnerNavigation,
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.pageNav.setNavItems(this.learnerNav.learnerSubMenu1);
    this.setTitle();
   }

  ngOnInit(): void {

  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.userId = params.id;
      (this.route.snapshot.data as { title: string }).title = `${this.name}`;
    });
  }
  

  activityTabs(tabName: string) {
    this.router.navigate(['/service-user/case-note-v2/case-note-v2'],
      { queryParams: { id: this.userId, name: this.name, SU: this.SU }});
  }

}
