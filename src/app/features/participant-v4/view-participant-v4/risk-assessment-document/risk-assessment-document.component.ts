import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { MatDialog } from '@angular/material/dialog';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../../environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { SnackBarService } from 'src/app/framework/service/snack-bar.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-risk-assessment-document',
  templateUrl: './risk-assessment-document.component.html',
  styleUrls: ['./risk-assessment-document.component.scss']
})
export class RiskAssessmentDocumentComponent implements OnInit {

  suId: number;
  name: string;
  SU: string;
  id: number;
  prn: any;
  profileUrl;
  displayedColumns: string[] = ['fileName', 'riskAssessmentDate', 'reviewDate', 'actions'];
  dataSource: any = new MatTableDataSource<any>();
  pageSize = 10;
  reversedObjectList;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackBarService: SnackBarService,
    private readonly riskAssessmentService: RiskAssessmentService,
  ) { 

    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu1);  
    this.setTitle();
  }

  ngOnInit(): void {
   this.getRiskAssessmentdocumentHistory(this.suId);
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.SU = params.SU;
      this.suId = params.id;
      this.prn = params.prn;
      this.route.snapshot.data.title = `${this.name}`;
    });
  }
  getRiskAssessmentdocumentHistory(suId) {
   
    let currentPageIndex = 0;
    if (!this.paginator) {
      currentPageIndex = 0;
    } else {
      currentPageIndex = this.paginator.pageIndex;
    }
  
      this.riskAssessmentService.getRiskAssessmentdocumentHistory(currentPageIndex, this.pageSize, suId)
        .subscribe(data => {
          this.reversedObjectList = data.content?.slice().reverse();

          this.dataSource = this.reversedObjectList;
          this.paginator.length = data.totalElements;

        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        });
 
  }

  onPaginateChange(event) {
    this.dataSource.paginator.pageIndex = event.pageIndex;
    this.dataSource.paginator.pageSize = event.pageSize;  }
 

  onRiskAssessment(){
    this.router.navigate([this.profileUrl+'/risk-assessment'],  { queryParamsHandling :"merge"});
  }

  onExitClicked(){
    this.router.navigate([this.profileUrl+'/participant-professional-view'],  { queryParamsHandling :"merge"});
  }
  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  download(path){
    let blobUrl = environment.cdnUrl +path;
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = blobUrl;
      a.click();
      document.body.removeChild(a);
  }

  ngAfterViewInit() {

 

    this.paginator.page
      .pipe(
        tap(() => {
          this.getRiskAssessmentdocumentHistory(this.suId);
          document.querySelector('#risk-document').scrollIntoView()
        })
      )
      .subscribe();
  }

  
}
