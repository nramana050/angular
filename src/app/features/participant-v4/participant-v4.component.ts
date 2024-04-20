import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { CaptrLearnersService } from '../captr-learners/captr-learners.services';
import { ILearners } from '../learners/learners.interface';
import { ManageUsersService } from '../manage-users/manage-users.service';

@Component({
  selector: 'app-participant-v4',
  templateUrl: './participant-v4.component.html',
  styleUrls: ['./participant-v4.component.scss']
})
export class ParticipantV4Component implements OnInit ,AfterViewInit{

  dataSource: any = new MatTableDataSource<ILearners>();
  displayedColumns: string[] = ['fullName', 'DateofBirth', 'Number', 'Worker', 'actions'];
  pageSize = 10;
  filterBy = { 'keyword': '', 'refUserType': 'SU', appId: localStorage.getItem('suAppId') };
  sortColumn = 'fullName';
  sortDirection = 'asc';
  select='All Service Users';
  showFilteredList: boolean = false;
  allServiceUserList: boolean = true;
  showcaseLoad: boolean = false;
  filteredListSize: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  userType: number = 3;


  constructor(private readonly route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly router: Router,
    private readonly snackBarService: SnackBarService,
    private readonly captrLearnersService: CaptrLearnersService,
    private readonly appConfirmService: AppConfirmService,
    private readonly manageUsersService: ManageUsersService,) {
  }

  ngOnInit(): void {
    this.resolveUsers(this.filterBy);

  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(data => {
      this.sortColumn = data.active;
      this.sortDirection = data.direction;
      this.paginator.pageIndex = 0;
      if (this.allServiceUserList) {
        this.resolveUsers(this.filterBy);
        this.showcaseLoad = false;
      } else {
        this.resolveFilteredServiceUsers(this.filterBy);
      }
    });

    this.paginator.page
    .pipe(
      tap(() => {
        if (this.allServiceUserList) {
          this.resolveUsers(this.filterBy);
        } else {
          this.resolveFilteredServiceUsers(this.filterBy);
        }
        document.querySelector('#view-programmes').scrollIntoView();
      }
      )
    )
    .subscribe();
}

  onFilter(filterString: string) {
    this.allServiceUserList = true;
    this.showFilteredList = false;
    this.select = 'All Service Users'; 
    this.showcaseLoad = false;
    this.filterBy.keyword = filterString;
    this.paginator.pageIndex = 0;
    this.resolveUsers(this.filterBy);
  }
  resolveUsers(filterBy) {
    this.allServiceUserList = true;
    this.showFilteredList = false;
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }

    this.captrLearnersService.findAllPaginated(`${this.sortColumn},${this.sortDirection}`, currentPageIndex, this.pageSize, filterBy)
      .subscribe(data => {
        data.content.forEach(element => {
          element.fullName = element.fullName;
        });
        data.content.forEach(element => {
          if (element.workerName === null) {
            element.workerfirstname = element.workerName;
          }
          else {
            element.workerfirstname = element.workerName.split(' ')[0];
          }
        }
        );
        this.dataSource.data = data.content;
        this.paginator.length = data.totalElements;
      },
        error => {
          this.snackBarService.error(`${error.error.applicationMessage}`);
          this.router.navigate(['./clink-learners']);
        });
  }

  resolveFilteredServiceUsers(filterBy) {
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
    this.captrLearnersService.getFilteredSUList(`${this.sortColumn},${this.sortDirection}`, this.pageSize, currentPageIndex, filterBy).subscribe(data => {
      data.content.forEach(element => {
      element.workerfirstname = element.workerName.split(' ')[0];
     });
      this.dataSource.data  = data.content;
      this.paginator.length = data.totalElements;
      this.filteredListSize = data.totalElements;
    })
  }

  findWorker(event) {
    if (event.value === 'My Service Users') {
      this.allServiceUserList = false;
      this.showFilteredList = true;
      this.showcaseLoad = true;
      this.paginator.pageIndex = 0;
      this.resolveFilteredServiceUsers(this.filterBy);

    } else {
      this.allServiceUserList = true;
      this.showcaseLoad = false;
      this.paginator.pageIndex = 0;
      this.resolveUsers(this.filterBy);
    }
  }

  onPaginatorChange() {
    if (this.allServiceUserList && !this.showFilteredList) {
      this.resolveUsers(this.filterBy);
    }
    else {
      this.resolveFilteredServiceUsers(this.filterBy);
    }
    document.querySelector('#view-programmes').scrollIntoView();
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  openCaseLoadPopup() {
    const dialogRef = this.appConfirmService.confirm({
      title: `Print Caseload`,
      message: `Are you sure you want to print caseload?`
    });

    dialogRef.subscribe(result => {
      if (result) {
      this.captrLearnersService.printCaseLoad().subscribe(res => {
           
      }, (error: any) => {
        this.snackBarService.error(`${error.error.applicationMessage}`);
      this.router.navigate(['./service-user']);
      }
    );
    }
    });
  }

  onClickAddParticipant() {

    this.manageUsersService.getValidLicences(this.userType).subscribe(data => {
      if (data.isAuthorisedLicence) {
        this.router.navigateByUrl('/clink-learners/new-learner');
      }
      else {
        this.notAddPopup();
      }

    })
    
  }

  notAddPopup() {
    const dialogRef = this.appConfirmService.confirm({
      title: `Licences`,
      message: `It appears you have exceeded your user limit for this account. 
      Please contact us on support.mailbox@meganexus.com or 0207 843 4343 `,
      showOkButtonOnly: true,
      padding : '22px'
    });
    dialogRef.subscribe(result => {
      if (result) { }
    });
  }
}


