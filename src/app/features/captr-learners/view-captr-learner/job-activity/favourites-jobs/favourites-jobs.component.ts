import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { Location } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { Utility } from 'src/app/framework/utils/utility';

@Component({
  selector: 'app-favourites-jobs',
  templateUrl: './favourites-jobs.component.html',
  styleUrls: ['./favourites-jobs.component.scss']
})
export class FavouritesJobsComponent implements OnInit {
  displayedColumns: string[] = ['job_title', 'date', 'location_name', 'expired'];
  dataSource = new MatTableDataSource<any>();

  page: number = 0;
  pageSize: number = 10;
  sortDireAndColumn: any = 'date,desc';
  favJobList: any[];
  totalItems: number = 0;
  jobId: string;
  userId: string;
  fname: string;
  lname: string;
  prn: string;
  profileUrl;


  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  
  constructor( private readonly learnersService: LearnersService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly location: Location,
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
   ) { 
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);

     this.setTitle();}
  
    setTitle() {
      this.route.queryParams.subscribe((params: any) => {
        if (params.id) {
          this.fname = params.name;
          this.userId = params.id;
          
        }
        this.route.snapshot.data['title'] = `${this.fname}`;
      });
    }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => { 
      this.userId = params.id;
    });
    this.resolveUsers();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((data)=>{
      this.sortDireAndColumn = `${data.active},${data.direction}`;
      this.paginator.pageIndex = 0;
      this.resolveUsers();
    });

    this.paginator.page
      .pipe(
        tap(() => {
          this.resolveUsers();
          document.querySelector('#favorites-jobs').scrollIntoView();
        })
      )
      .subscribe();
  }
    resolveUsers() {
      let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
      this.learnersService.getFavJobList( this.userId, currentPageIndex, this.pageSize, this.sortDireAndColumn)
      .subscribe(data => {
        this.dataSource.data =data.content;
          this.paginator.length = data.totalElements;
        },error => {
          this.snackBarService.error(`${error.error.applicationMessage}`);
          this.router.navigate(['./favourites']);
        });
    }

    ngOnDestroy() {
      this.inPageNavService.setNavItems(null);
    }

    onExitClicked() {
      this.router.navigate([this.profileUrl]);
    }

}
