import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-entry-induction',
  templateUrl: './entry-induction.component.html',
  styleUrls: ['./entry-induction.component.scss']
})
export class EntryInductionComponent implements OnInit {
  @Input() entryData: any;
  textPrimaryHex = '#000000';
  textSecondaryHex = '#505a5f';

  constructor() { }

  ngOnInit() {
  }

  setAnswerColor(answer) {
    const isToAnswer = answer.substring(0, 2) === 'To'
    if (isToAnswer) {
      return this.textPrimaryHex
    } else {
      return this.textSecondaryHex
    }
  }

}
