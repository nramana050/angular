import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { AppConfirmService } from 'src/app/framework/components/app-confirm/app-confirm.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { MatDialog } from '@angular/material/dialog';
import { MentivityLearnerNavigation } from 'src/app/features/mentivity-learners/view-mentivity-learners/mentivity-learner-nav';
import { ReferralService } from 'src/app/features/captr-learners/view-captr-learner/referral/referral.service';
import { PrintReferralsComponent } from 'src/app/features/captr-learners/view-captr-learner/referral/print-referrals/print-referrals.component';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  name: any;
  userId: any;
  SU: string = 'SU';
  caseNote : boolean;
  displayedColumns: string[] = ['otherIntervention', 'referralDate', 'workerName', 'notes','otherOrganisation','outcome','symbol'];
  dataSource: MatTableDataSource<any>;
  referalMaxCount: any;
  serviceUserId: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSize = 10;
  isReferralsEmpty = false;
  profileUrl;

  
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly inPageNavService: InPageNavService,
    private readonly referralService: ReferralService,
    private readonly snackBarService: SnackBarService,
    private readonly appConfirmService: AppConfirmService,
    private readonly sessionService: SessionsService,
    private readonly learnerNavigation: LearnerNavigation,
    public dialog: MatDialog
  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu1);
      this.setTitle();
   }

  ngOnInit(): void {
    this.getnotes();

  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.userId = params.id;
      this.route.snapshot.data.title = `${this.name}`;
    });
  }

  getnotes() {
    this.referralService.getReferralNote(this.userId).subscribe(data => {
      this.referalMaxCount = data.length;
      if(data.length > 0) {
        data.forEach(element => {
          element.workerName = element.workerName.split(' ')[0];
        });
        this.dataSource = new MatTableDataSource(data) ;
        this.dataSource.paginator = this.paginator;
        this.isReferralsEmpty = false;
      }
      else {
        this.isReferralsEmpty = true 
      }
      
    }, error => {
      this.snackBarService.error(error.error.applicationMessage);
    })
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  addReferral() {
      this.router.navigate([this.profileUrl + '/referral/add-referral'],{ queryParamsHandling :"merge"})
  }

  onPageChange(event: any) {
    this.dataSource.paginator.pageIndex = event.pageIndex;
    this.dataSource.paginator.pageSize = event.pageSize;
  }

  onDeleteReffClicked(id) {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete Referral`,
      message: `Are you sure you want to delete referral?`
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.referralService.deleteReferral(id).subscribe(data => {
          this.snackBarService.success(data.message.applicationMessage);
          this.getnotes();
        }, (error: any) => {
          this.snackBarService.error(error.error.applicationMessage);
        }
        );
      }
    });
  }

  isAuthorized(fid, opId) {
    return this.sessionService.hasResource([fid.toString(), opId.toString()])
  }
  openPrintDialog() {
    const dialogRef = this.dialog.open(PrintReferralsComponent,{
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onExitClicked() {
    this.router.navigate([this.profileUrl +'/participant-professional-view'],{ queryParamsHandling :"merge"}); 
    }


}
