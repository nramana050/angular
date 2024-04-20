import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from './../../../../../../../framework/service/snack-bar.service';
import { Utility } from './../../../../../../../framework/utils/utility';
import { EditInterventionModalComponent } from '../../f-structure-modals/edit-intervention-modal/edit-intervention-modal.component';
import { TrackTabService } from '../../track-tab.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';

@Component({
  selector: 'app-entry-intervention',
  templateUrl: './entry-intervention.component.html',
  styleUrls: ['./entry-intervention.component.scss']
})
export class EntryInterventionComponent implements OnInit {
  @Input() entryData: any;
  @Input() statusList: any;
  @Input() outcomeList: any;
  @Input() withdrawalList: any;
  @Input() interventionList:any;
  @Input() pathwayList:any;
  dateSeparator = ' - '
  textPrimaryHex = '#000000';
  textSecondaryHex = '#505a5f';
  @Output() handleUpdateInterventionEntry = new EventEmitter
  isAuthorized = false;

  constructor(
    public dialog: MatDialog,
    private readonly trackTabService: TrackTabService,
    private readonly snackBarService: SnackBarService,
    private readonly sessionService: SessionsService
  ) { }

  ngOnInit() {
    this.isAuthorized = this.sessionService.hasResource(['9','3']);
    this.formatTitle()
    this.formatInterventionDates()
  }

  formatTitle() {
    this.entryData.title = this.entryData?.title?.charAt(0).toUpperCase() + this.entryData?.title?.slice(1);
  }

  formatInterventionDates() {
    const hyphenIndex = this.entryData.subTitle.indexOf('-')
    this.entryData.startDate = this.entryData.subTitle.substring(0, hyphenIndex - 1)
    this.entryData.endDate = this.entryData.subTitle.substring(hyphenIndex + 2)
    this.entryData.contactName=this.entryData.contactName.split(' ')[0]; 
  }

  setPathwayBackgroundColor(pathwayName) {
    let colorCode = this.pathwayList.filter(data => data.name === pathwayName)[0].colorCode;
    return colorCode;
  }

  setDateFontColor(interventionType, dateType) {
    if (interventionType === 'Start') {
      switch(dateType) {
        case 'Start':
          return this.textPrimaryHex;
        case 'Separator':
          return this.textSecondaryHex;
        case 'End':
          return this.textSecondaryHex;
        default:
          return this.textPrimaryHex;
      }
    } else {
      switch(dateType) {
        case 'Start':
          return this.textSecondaryHex;
        case 'Separator':
          return this.textSecondaryHex;
        case 'End':
          return this.textPrimaryHex;
        default:
          return this.textPrimaryHex;
      }
    }
  }

  openEditInterventionModal() {
    const dialogRef = this.dialog.open(EditInterventionModalComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        interventionId: this.entryData.id,
        pathwayName: this.entryData.pathway,
        statusList: this.statusList,
        outcomeList: this.outcomeList,
        withdrawalList:this.withdrawalList,
        interventionList: this.interventionList,
        pathwayList: this.pathwayList,
      }
    });
    dialogRef.afterClosed().subscribe(editInterventionPayload => {
      if (editInterventionPayload) {
        const formattedPayload = {
          ...editInterventionPayload,
          "otherIntName": editInterventionPayload.otherIntName !== null ? editInterventionPayload.otherIntName : null,
          "startDate": Utility.transformDateToString(editInterventionPayload.startDate),
          "plannedEndDate": Utility.transformDateToString(editInterventionPayload.plannedEndDate),
          "actualEndDate": Utility.transformDateToString(editInterventionPayload.actualEndDate),
          "outcomeId": editInterventionPayload.outcomeId ? editInterventionPayload.outcomeId : null   
        }
        this.trackTabService.updateSingleIntervention(formattedPayload).subscribe(response => {
          this.snackBarService.success(response.message.successMessage);
          this.handleUpdateInterventionEntry.emit()
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      }
    });
  }

}
