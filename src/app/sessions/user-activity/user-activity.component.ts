import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-inactivity',
  template: `
  <h3 matDialogTitle>{{ data.title }}</h3>
    <div mat-dialog-content>
    <p>{{ data.message }} {{ (minutesDisplay) }}:{{ (secondsDisplay) && (secondsDisplay <=59) ? secondsDisplay : '00' }}.</p>
    <p>{{ data.actionMessage }}</p>
    </div>
    <div mat-dialog-actions style="display:flex; margin: 24px 0 12px 0;">
    <button type="button" mat-stroked-button color="primary" (click)="dialogRef.close(true)">Continue</button>
    <span style="flex: 1 1 auto;"></span>
    <button type="button" color="accent" mat-stroked-button (click)="dialogRef.close(false)">Sign out</button>
    </div>
  `,
  styles: [
    `h3 {color: #1b2040; font-size: 1.8em; font-weight: 100;}`
  ]
})
export class UserActivityComponent implements OnDestroy, OnInit {

  minutesDisplay = 0;
  secondsDisplay = 0;
  endTime = 2 * 60;
  countdownSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<UserActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.startCountdown(this.data.countdown);
  }

  ngOnDestroy() {
    this.countdownSubscription.unsubscribe();
  }

  startCountdown(endTime: number = this.endTime) {
    const interval = 1000;
    const duration = endTime;
    this.countdownSubscription = timer(0, interval)
      .pipe(
        take(duration)
      )
      .subscribe(value => {
        this.render((duration - +value) * interval);
      },
        err => { },
        () => {
          this.countdownSubscription.unsubscribe();
          this.dialogRef.close(false);
        }
      );
  }

  private render(count) {
    this.secondsDisplay = this.getSeconds(count);
    this.minutesDisplay = this.getMinutes(count);
  }

  private getSeconds(ticks: number) {
    const seconds = ((ticks % 60000) / 1000).toFixed(0);
    return this.pad(seconds);
  }

  private getMinutes(ticks: number) {
    const minutes = Math.floor(ticks / 60000);
    return this.pad(minutes);
  }

  private pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }

}
