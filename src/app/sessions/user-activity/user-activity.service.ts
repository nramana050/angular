import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../framework/constants/url-constants'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserActivityComponent } from './user-activity.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserActivityService {

  private _lastActivity = new Date().getTime();
  get lastActivity() { return this._lastActivity; }
  set lastActivity(activityTimestamp) {
    this._lastActivity = activityTimestamp;
  }

  constructor(
    private readonly http: HttpClient,
    private readonly dialog: MatDialog,
  ) { }


  checkHeartbeat() {
    return this.http.get<any>(`${BaseUrl.AUTHENTICATE}/checkHeartbeat`);
  }

  public openCountdownWarning(
    countdown: number, dialogTitle?: string, dialogMessage?: string, dialogActionMessage?: string): Observable<boolean> {

    const title = dialogTitle ||
      `Your session will expire!`;
    const message = dialogMessage ||
      `You will be signed out in `;
    const actionMessage = dialogActionMessage ||
      `Click "Continue" if you'd like to stay.`;
    let dialogRef: MatDialogRef<UserActivityComponent>;
    dialogRef = this.dialog.open(UserActivityComponent, {
      width: '480px',
      disableClose: true,
      data: { title, message, countdown, actionMessage }
    });
    return dialogRef.afterClosed();
  }

}
