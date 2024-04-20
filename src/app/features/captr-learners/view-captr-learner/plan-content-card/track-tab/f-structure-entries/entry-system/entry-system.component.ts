import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-entry-system',
  templateUrl: './entry-system.component.html',
  styleUrls: ['./entry-system.component.scss']
})
export class EntrySystemComponent implements OnInit {
  @Input() entryData: any;

  constructor() { }

  ngOnInit() {
  }

}
