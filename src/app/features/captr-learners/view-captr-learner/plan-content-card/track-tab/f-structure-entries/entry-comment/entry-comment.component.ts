import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnackBarService } from './../../../../../../../framework/service/snack-bar.service';
import { TrackTabService } from '../../track-tab.service';
import { AppConfirmService } from './../../../../../../../framework/components/app-confirm/app-confirm.service';
import { SessionsService } from 'src/app/features/shared/services/sessions.service';

@Component({
  selector: 'app-entry-comment',
  templateUrl: './entry-comment.component.html',
  styleUrls: ['./entry-comment.component.scss']
})
export class EntryCommentComponent implements OnInit {
  @Input() entryData: any;
  @Output() handleUpdateCommentEntry = new EventEmitter
  isAuthorized = false;

  constructor(
    private readonly appConfirmService: AppConfirmService,
    private readonly trackTabService: TrackTabService,
    private readonly snackBarService: SnackBarService,
    private readonly sessionService: SessionsService
  ) { }

  ngOnInit() {
    this.isAuthorized = this.sessionService.hasResource(['9','4']);
    this.formatComment()
    this.formatSubtitle()
  }

  formatComment() {
    this.entryData.description = this.entryData.description.charAt(0).toUpperCase() + this.entryData.description.slice(1);
  }

  formatSubtitle() {
    const afterByIndex = this.entryData.subTitle.indexOf("by");
    this.entryData.formattedSubtitle = this.entryData.subTitle.slice(0, afterByIndex + 3)
    this.entryData.keyWorkerName = this.entryData.subTitle.slice(afterByIndex + 3)
    this.entryData.keyWorkerName =this.entryData.keyWorkerName.split(' ')[0];
  }

  openConfirmDeleteCommentModal() {
    const dialogRef = this.appConfirmService.confirm({
      title: `Delete comment`,
      message: `Are you sure you want to delete this comment?`,
      showTextField: false,
      placeholderTextField: ''
    });

    dialogRef.subscribe(result => {
      if (result) {
        this.trackTabService.deleteComment(this.entryData.id).subscribe(response => {
          this.snackBarService.success(response.message.successMessage);
          this.handleUpdateCommentEntry.emit()
        }, error => {
          this.snackBarService.error(error.error.applicationMessage);
        })
      }
    });
  }

}
