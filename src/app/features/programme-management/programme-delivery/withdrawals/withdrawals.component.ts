import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { ManageUsersService } from 'src/app/features/manage-users/manage-users.service';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { Utility } from 'src/app/framework/utils/utility';
import { ProgrammeDeliveryNavigation } from '../programme-delivery-nav';
import { ProgrammeDeliveryService } from '../programme-delivery.service';
import { ViewProgrammeDeliveryNavigation } from '../view-programme-delivery/view-programme-delivery-nav';

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class WithdrawalsComponent implements OnInit,OnDestroy {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  qualificationColumn = ['qualificationName', 'qualificationStatus']
  displayedColumns = ["learnerName", 'withdrawalDate']
  coursesColumns: string[] = ['courseName', 'isCourseCompleted', 'qualificationName', 'qualificationStatus'];
  allLearners: any = [];
  withdrawalLearnersData: any[];
  manageUserService: ManageUsersService;
  programmeDeliveryService: ProgrammeDeliveryService;
  inPageNavService: InPageNavService;
  currentDate: any = new Date();
  deliveryStartDate;
  isHidden = false;
  pDeliveryName;
  refData: any;

  constructor(
    private readonly learnersService: LearnersService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly programmeDeliveryNavigation: ProgrammeDeliveryNavigation,
    private readonly viewProgrammeDeliveryNavigation: ViewProgrammeDeliveryNavigation,
    private readonly route: ActivatedRoute,
    private readonly injector: Injector,
  ) {
    this.programmeDeliveryService = this.injector.get(ProgrammeDeliveryService);
    this.manageUserService = this.injector.get(ManageUsersService);
    this.inPageNavService = this.injector.get(InPageNavService);
    this.inPageNavService.setNavItems(this.programmeDeliveryNavigation.programmeDeliverySubMenu);
    this.learnersService.getRefData().subscribe(data => {
      this.refData = data;
    })
  }

  ngOnInit() {
    const currentRoute = this.route.snapshot.url.join('/');
    if(currentRoute == 'programme-delivery/view-withdrawals'){
      this.inPageNavService.setNavItems(this.viewProgrammeDeliveryNavigation.programmeDeliverySubMenu);
    }
    this.manageUserService.getAllSuUserByLggedInClient().subscribe(data => {
      this.allLearners = data;
      this.allLearners.forEach(learner => { 
        learner.value = learner.firstName + ' ' + learner.lastName;
      })
      this.resolveWithdrawalLearner();
    })
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  resolveWithdrawalLearner() {
    this.route.queryParams.subscribe((params: any) => {
      this.pDeliveryName = params.pname;
      this.programmeDeliveryService.getProgrammeDeliveryDetails(params.id).subscribe(data => {
        this.deliveryStartDate = data.programmeCourseDelivery[0].startDate
        this.currentDate = Utility.dateToString(this.currentDate)
        if (this.deliveryStartDate > this.currentDate) {
          this.isHidden = true;
        }
        else {
          this.programmeDeliveryService.getWithdrawalLearnersData(params.id).subscribe(learner => {
            this.withdrawalLearnersData = learner.learnerData;
          })
        }
      })

    })
  }

  ngOnDestroy(): void {
    this.inPageNavService.setNavItems(null);
  }
}