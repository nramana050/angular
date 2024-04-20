import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { LearnerNavigation } from '../../learner-nav';
import { ActivatedRoute, Route } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddInterventionModalComponent } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-intervention-modal/add-intervention-modal.component';
import { SnackBarService } from '../../../../../framework/service/snack-bar.service';
import { TrackTabService } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/track-tab.service';
import { Utility } from '../../../../../framework/utils/utility';
import { AddOrEditAppointmentModalComponent } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-or-edit-appointment-modal/add-or-edit-appointment-modal.component';
import { AddCommentModalComponent } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/add-comment-modal/add-comment-modal.component';
import { forkJoin } from 'rxjs';
import { SelectAnActivityModalComponent } from 'src/app/features/captr-learners/view-captr-learner/plan-content-card/track-tab/f-structure-modals/select-an-activity-modal/select-an-activity-modal.component';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
@Component({
  selector: 'app-timeline-system-interaction',
  templateUrl: './timeline-system-interaction.component.html',
  styleUrls: ['./timeline-system-interaction.component.scss']
})
export class TimelineSystemInteractionComponent implements OnInit {

  userId: any; 
  @Input() fStructureData: any;
  @Input() loadMoreVisible: boolean;
  @Output() loadMore = new EventEmitter();
  @Output() refreshFStructureData = new EventEmitter();
  @Output() emitUpdateInterventionEvent= new EventEmitter();

  activityRefData: any;
  serviceUserId: number;
  currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  workers: any;
  interventions: any;
  pathwayList=[];
  isAuthorized = false;
  profileUrl;

  constructor(
    private readonly inPageNavService: InPageNavService,
    private readonly learnerNavigation: LearnerNavigation,
    private readonly route: ActivatedRoute,
    public  dialog: MatDialog,
    private readonly snackBarService: SnackBarService,
    private readonly trackTabService: TrackTabService,
    private readonly learnerService:LearnersService,
    private readonly sessionService:SessionsService,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.inPageNavService.setNavItems(this.learnerNavigation.learnerSubMenu);
      this.setTitle();
   }

   ngOnInit() {
    //this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.resolveServiceUserId();
    this.resolveActivityRefData();
   
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.userId = params.id;
      this.route.snapshot.data.title = `${params.name}`;
    });
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

  resolveServiceUserId() {
    this.route.queryParams.subscribe(params => {
      this.serviceUserId = parseInt(params['id']);
    });
  }

  resolveActivityRefData() {
    this.trackTabService.getActivityRefData().subscribe(data => {
      this.activityRefData = data;
    })
  }

  addEntry() {
    this.openSelectAnActivityModal();
  }

  openSelectAnActivityModal(): void {
    const dialogRef = this.dialog.open(SelectAnActivityModalComponent, {
      disableClose: true,
      autoFocus: false,
      height: '300px',
      width: '450px',
      data: this.activityRefData.activityList.filter(activity => !activity.identifier.includes('SI'))
    });
    dialogRef.afterClosed().subscribe((selectedActivity) => {
      let identifier: string = selectedActivity.identifier
      if (identifier.includes('INT')) {
        this.openAddInterventionModal()
      }
      else if (identifier.includes('APPT')) {
        forkJoin(this.trackTabService.getInterventionList(this.serviceUserId), this.learnerService.getKwList(['CAPTRSA','EUCICCAPTRSA', 'C2CDIGITALCAPTRSA'])).subscribe(response => {
          this.interventions = response[0];
          this.workers = response[1].filter(worker => worker.isActive === true);
          this.openAddAppointmentModal();
        });
      }
      else if (identifier.includes('CMT')) {
        this.openAddCommentModal();
      }
    });
  }

  openAddInterventionModal(): void {
    const dialogRef = this.dialog.open(AddInterventionModalComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        pathwayList: this.activityRefData.pathwayList,
        interventionList: this.activityRefData.interventionList,
      }
    });

    dialogRef.afterClosed().subscribe(addInterventionPayload => {
      
      if (addInterventionPayload) {
        this.getPathwayIdList(addInterventionPayload);
        const formattedPayload = {
          "activityId": this.activityRefData.activityList.filter(activity => activity.name === 'Intervention')[0].id,
          "id": 0,
          "refInterventionId": addInterventionPayload.interventionName.id,
          "otherIntName": addInterventionPayload.otherInterventionName,
          "pathwayId": this.pathwayList,
          "plannedEndDate": Utility.transformDateToString(addInterventionPayload.plannedEndDate),
          "serviceUserId": this.serviceUserId,
          "startDate": Utility.transformDateToString(addInterventionPayload.startDate),
          "contactName": addInterventionPayload.contactName,
          "telephone": addInterventionPayload.telephone,
          "email": addInterventionPayload.email,
          "description": addInterventionPayload.interventionDescription,
        }
        
        this.trackTabService.createIntervention(formattedPayload).subscribe(response => {
          this.snackBarService.success(response.message.successMessage);
          this.refreshFStructureData.emit();
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      }
      this.pathwayList=[];
    });
  }

  getPathwayIdList(payload){
    for(let i=0;i<payload.pathway.length;i++){
    this.pathwayList.push(payload.pathway[i].id);
    }
  }
  
  formatAppointmentTime(timeHours, timeMinutes) {
    if(timeHours !== undefined && timeMinutes !== undefined && timeHours !== null && timeMinutes !== null){
      const timeHoursString = `${timeHours}`;
      if (timeHoursString.length === 1) {
        return `0${timeHours}:${timeMinutes}`
      } else {
        return `${timeHours}:${timeMinutes}`
      } 
    }
    return null;
  }

   openAddAppointmentModal(): void {
    const dialogRef = this.dialog.open(AddOrEditAppointmentModalComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        appointmentId: null,
        appointmentList: this.activityRefData.appointmentList,
        pathwayList: this.activityRefData.pathwayList,
        statusList: this.activityRefData.statusList.filter(status => 
          status.activityId === this.activityRefData.activityList.filter(activity => activity.identifier.includes('APPT'))[0].id
        ),
        workers: this.workers,
        interventions: this.interventions,
        organizationList: this.activityRefData.organizationList
      }
    });
    dialogRef.afterClosed().subscribe(addAppointmentData => {
      if (addAppointmentData) {
        const formattedPayload = {
          "activityId": this.activityRefData.activityList.filter(activity => activity.name === 'Appointment')[0].id,
          "appointmentId": addAppointmentData.formValues.appointmentType.id,
          "id": 0,
          "interventionId": addAppointmentData.formValues.interventionLink ? addAppointmentData.formValues.interventionLink.id : null,
          "organizationId" : addAppointmentData.formValues.organizationId,
          "otherOrganization" : null,
          "mdate": Utility.transformDateToString(addAppointmentData.formValues.date),
          "mtime": this.formatAppointmentTime(addAppointmentData.formValues.timeHours, addAppointmentData.formValues.timeMinutes),
          "notes": addAppointmentData.isAppointmentInPast ? addAppointmentData.formValues.meetingNotes : null,
          "other": addAppointmentData.formValues.appointmentType.id === this.activityRefData.appointmentList.filter(appointment => appointment.name === 'Other')[0].id ? 
            addAppointmentData.formValues.otherAppointmentName : null,
          "serviceUserId": this.serviceUserId,
          "staffId": addAppointmentData.formValues.worker.id,
          "statusId": addAppointmentData.isAppointmentInPast ? addAppointmentData.formValues.attendance.id : null,
          "meetingEndtime": this.formatAppointmentTime(addAppointmentData.formValues.endTimeHours, addAppointmentData.formValues.endTimeMinutes),​
        }
        this.trackTabService.createMeeting(formattedPayload).subscribe(response => {
          this.snackBarService.success(response.message.successMessage);
          this.refreshFStructureData.emit();
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      }
    });
  }

  openAddCommentModal(): void {
    const dialogRef = this.dialog.open(AddCommentModalComponent, {
      disableClose: true,
      autoFocus: false,
      width: '550px',
    });
    dialogRef.afterClosed().subscribe(addCommentPayload => {
      if (addCommentPayload) {
        const formattedPayload = {
          "activityId": this.activityRefData.activityList.filter(activity => activity.name === 'Comment')[0].id,
          "id": 0,
          "notes": addCommentPayload.comment,
          "serviceUserId": this.serviceUserId,
        }
        this.trackTabService.createComment(formattedPayload).subscribe(response => {
          this.snackBarService.success(response.message.successMessage);
          this.refreshFStructureData.emit();
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      }
    });
  }

  setEntryMarginBottom(index) {
    if (index + 1 === this.fStructureData.length) {
      return '0px'
    } else {
      return '60px'
    }
  }

  setInductionEntryMarginBottom(index) {
    if (
      this.fStructureData[index + 1] && 
      this.fStructureData[index + 1].activityId === -1 && 
      this.fStructureData[index + 1].entryDateUnix === this.fStructureData[index].entryDateUnix
    ) {  
      return '-10px'
    } else if (index + 1 === this.fStructureData.length) {
      return '0px'
    } else {
      return '60px'
    }
  }

  decideIfShouldShowInductionIcon(index) {
    if (
      this.fStructureData[index - 1].activityId === -1 && 
      this.fStructureData[index - 1].entryDateUnix === this.fStructureData[index].entryDateUnix
    ) {
      return 'none'
    } else {
      return 'flex'
    }
  }

  setFLineHeight(index) {
    if (index + 1 === this.fStructureData.length && !this.loadMoreVisible) {
      return '0px'
    } else {
      if (this.fStructureData[index].activityId === -1) {
        let allInductionEntriesFlag = true;
        for (let i = 1; i < this.fStructureData.length; i++) {
          if (this.fStructureData[i].activityId !== -1) {
            allInductionEntriesFlag = false;
          }
        }
        return this.setFLineHeightIfAllEntriesAreInduction(allInductionEntriesFlag)
      }
      return 'auto'
    }
  }

  setFLineHeightIfAllEntriesAreInduction(allInductionEntriesFlag) {
    if (allInductionEntriesFlag) {
      return '0px'
    } else {
      return 'auto'
    }
  }

  onClickLoadMore() {
    this.loadMore.emit();
  }

  getFilteredStatusList() {
    if (this.activityRefData) {
      return this.activityRefData.statusList.filter(status => status.activityIdentifier.includes('INT'))
    } else {
      return []
    }
  }

  onUpdateEntry(event) {
    this.emitUpdateInterventionEvent.emit('event')
  }

  shouldShowTodayLineBrackets(i) {
    if (i  < this.fStructureData.length - 1) {
      if (this.fStructureData[i + 1].entryDateUnix === this.fStructureData[i].entryDateUnix) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  getActivityId(activityName) {
    if (this.activityRefData) {
      return this.activityRefData.activityList.filter(activity => activity.name === activityName)[0].id
    } else {
      return undefined
    }
  }
}

