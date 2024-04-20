import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SnackBarService } from './../../../../../../../framework/service/snack-bar.service';
import { Utility } from './../../../../../../../framework/utils/utility';
import { AddOrEditAppointmentModalComponent } from '../../f-structure-modals/add-or-edit-appointment-modal/add-or-edit-appointment-modal.component';
import { TrackTabService } from '../../track-tab.service';
import { LearnersService } from 'src/app/features/learners/learners.services';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';

@Component({
  selector: 'app-entry-appointment',
  templateUrl: './entry-appointment.component.html',
  styleUrls: ['./entry-appointment.component.scss']
})
export class EntryAppointmentComponent implements OnInit {
  @Input() entryData: any;
  @Input() activityRefData: any;
  interventions = undefined;
  workers = undefined;
  serviceUserId: number;
  @Output() handleUpdateAppointmentEntry = new EventEmitter
  isAuthorized = false;

  constructor(
    public dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly trackTabService: TrackTabService,
    private readonly snackBarService: SnackBarService,
    private readonly learnerService: LearnersService,
    private readonly sessionService: SessionsService
  ) { }

  ngOnInit() {
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.resolveServiceUserId();
    this.formatTitle()
    this.formatSubtitle()
    this.formatInterventionName()
  }

  resolveServiceUserId() {
    this.route.queryParams.subscribe(params => {
      this.serviceUserId = parseInt(params['id']);
    });
  }

  formatTitle() {
    this.entryData.title = this.entryData.title.charAt(0).toUpperCase() + this.entryData.title.slice(1);
  }

  formatSubtitle() {
    const afterWithIndex = this.entryData.subTitle.indexOf("with");
    this.entryData.formattedSubtitle = this.entryData.subTitle.slice(0, afterWithIndex + 5)
    this.entryData.keyWorkerName = this.entryData.subTitle.slice(afterWithIndex + 5)
    if(this.entryData.keyWorkerName[0]!==' '){
      this.entryData.keyWorkerName =this.entryData.keyWorkerName.split(' ')[0];
    }else{
      this.entryData.keyWorkerName =this.entryData.keyWorkerName.split(' ')[1];
    }
    
  }

  formatInterventionName() {
    if (this.entryData.interventionName) {
      this.entryData.interventionName = this.entryData.interventionName.charAt(0).toUpperCase() + this.entryData.interventionName.slice(1);
    }
  }

  setBulletColor(pathwayName) {
    let colorCode = this.activityRefData.pathwayList.filter(data => data.name === pathwayName)[0].colorCode;
    return colorCode;
  }

  openAddOrEditAppointmentModal() {
    forkJoin(this.trackTabService.getInterventionList(this.serviceUserId), this.learnerService.getKwList(['CAPTRSA','EUCICCAPTRSA', 'C2CDIGITALCAPTRSA'])).subscribe(response => {
      this.interventions = response[0];
      this.workers = response[1].filter(worker => worker.isActive === true);
      const dialogRef = this.dialog.open(AddOrEditAppointmentModalComponent, {
        disableClose: true,
        autoFocus: false,
        data: {
          appointmentId: this.entryData.id,
          appointmentList: this.activityRefData.appointmentList,
          pathwayList: this.activityRefData.pathwayList,
          statusList: this.activityRefData.statusList.filter(status => status.activityIdentifier.includes('APPT')),
          workers: this.workers,
          interventions: this.interventions,
          organizationList: this.activityRefData.organizationList
        }
      });
      dialogRef.afterClosed().subscribe(updateAppointmentData => {
        if (updateAppointmentData) {
          this.updateMeeting(updateAppointmentData)
        }
      });
    });
  }

  updateMeeting(updateAppointmentData) {
    const formattedPayload = {
      "activityId": this.entryData.activityId,
      "appointmentId": updateAppointmentData.formValues.appointmentType.id,
      "id": this.entryData.id,
      "interventionId": updateAppointmentData.formValues.interventionLink ? updateAppointmentData.formValues.interventionLink.id : null,
      "organizationId" :updateAppointmentData.formValues.organizationId,
      "otherOrganization" : updateAppointmentData.formValues.otherOrganization,
      "mdate": Utility.transformDateToString(updateAppointmentData.formValues.date),
      "mtime": this.formatAppointmentTime(updateAppointmentData.formValues.timeHours, updateAppointmentData.formValues.timeMinutes),
      "notes": updateAppointmentData.isAppointmentInPast ? updateAppointmentData.formValues.meetingNotes : null,
      "other": updateAppointmentData.formValues.appointmentType.id === this.activityRefData.appointmentList.filter(data => data.identifier.includes('OTH'))[0].id ? updateAppointmentData.formValues.otherAppointmentName : null,
      "serviceUserId": this.serviceUserId,
      "staffId": updateAppointmentData.formValues.worker.id,
      "statusId": updateAppointmentData.isAppointmentInPast ? updateAppointmentData.formValues.attendance.id : null,
      "meetingEndtime": this.formatAppointmentTime(updateAppointmentData.formValues.endTimeHours, updateAppointmentData.formValues.endTimeMinutes),
    }
    this.trackTabService.updateSingleMeeting(formattedPayload).subscribe(response => {
      this.snackBarService.success(response.message.successMessage);
      this.handleUpdateAppointmentEntry.emit()
    }, error => {
      this.snackBarService.error(error.error.applicationMessage);
    })
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

}
