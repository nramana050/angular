import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CaptrLearnersService } from 'src/app/features/captr-learners/captr-learners.services';
import { ActivatedRoute } from '@angular/router';
import { LearnerNavigation } from 'src/app/features/captr-learners/view-captr-learner/learner-nav';
import { InPageNavService } from 'src/app/framework/components/in-page-nav/in-page-nav.service';
import { ParticipantNavigation } from '../../participant-nav';
import { Utility } from 'src/app/framework/utils/utility';
import { ProfileUrlIdentifier } from 'src/app/framework/constants/PageTitleIdentifier-constants';
@Component({
  selector: 'app-view-case-note-v2',
  templateUrl: './view-case-note-v2.component.html',
  styleUrls: ['./view-case-note-v2.component.scss']
})
export class ViewCaseNoteV2Component implements OnInit {

  caseNoteData: any = {};
  SU: any;
  @Input() jobId: any;
  flag: any = true;
  userId: any = 0;
  name: any;
  caseNoteId: any;
  UserId: number;
  hours = [
    { value: 0, label: '00' }, { value: 1, label: '01' }, { value: 2, label: '02' }, { value: 3, label: '03' }, { value: 4, label: '04' }, { value: 5, label: '05' },
    { value: 6, label: '06' }, { value: 7, label: '07' }, { value: 8, label: '08' }, { value: 9, label: '09' }, { value: 10, label: '10' }, { value: 11, label: '11' },
    { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 14, label: '14' }, { value: 15, label: '15' }, { value: 16, label: '16' }, { value: 17, label: '17' },
    { value: 18, label: '18' }, { value: 19, label: '19' }, { value: 20, label: '20' }, { value: 21, label: '21' }, { value: 22, label: '22' }, { value: 23, label: '23' },
  ];

  minutes = ['00', '15', '30', '45'];
  startTime: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  endTime: string;
  lenOfVisit: string
  profileUrl;

  constructor(
    private readonly captrLearnerService: CaptrLearnersService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly participantNavigation: ParticipantNavigation,
    private readonly inPageNavService: InPageNavService,
    private readonly pageNav: InPageNavService,
    private readonly learnerNav: LearnerNavigation,

  ) {
    this.profileUrl = Utility.getProfileUrl(ProfileUrlIdentifier.PROFILE_URL);
    this.pageNav.setNavItems(this.learnerNav.learnerSubMenu1);
    this.setTitle();
    this.route.params.subscribe((params: any) => {
      this.userId = params.id;
      if (params.hasOwnProperty('id')) {
        this.name = params.name;
        this.SU = params.SU;
        // this.caseNoteId = params.id;
      }
    });
  }

  setTitle() {
    this.route.queryParams.subscribe((params: any) => {
      this.name = params.name;
      this.userId = params.id;
      this.caseNoteId = params.caseNoteId;
      (this.route.snapshot.data as { title: string }).title = `${this.name}`;
    });
  }

  ngOnInit() {
    this.captrLearnerService.viewUserCaseNote(this.caseNoteId).subscribe(data => {
      data.noteSenderName = data.noteSenderName.split(' ')[0];
      this.caseNoteData = data;
      if (this.caseNoteData.startTime != null) {
        const meetingTimeSplitArr = this.caseNoteData.startTime.split(':');
        const hoursArrIndexOfAppointment = this.hours.findIndex(hour => hour.label === meetingTimeSplitArr[0])
        this.startHour = this.hours[hoursArrIndexOfAppointment].label;
        const minutesArrIndexOfAppointment = this.minutes.findIndex(minute => minute === meetingTimeSplitArr[1])
        this.startMinute = this.minutes[minutesArrIndexOfAppointment];
        this.startTime = (this.startHour + ':' + this.startMinute);
      }
      if (this.caseNoteData.endTime != null) {
        const meetingEndTimeSplitArr = this.caseNoteData.endTime.split(':');
        const _hoursArrIndexOfAppointment = this.hours.findIndex(hour => hour.label === meetingEndTimeSplitArr[0])
        this.endHour = (this.hours[_hoursArrIndexOfAppointment].label);
        const _minutesArrIndexOfAppointment = this.minutes.findIndex(minute => minute === meetingEndTimeSplitArr[1])
        this.endMinute = (this.minutes[_minutesArrIndexOfAppointment]);
        this.endTime = (this.endHour + ':' + this.endMinute);
        this.convertToTimeFormat(this.caseNoteData.lengthOfVisit);
      }
    });
  }

  convertToTimeFormat(lengthOfVisit) {
    var hour = '';
    var minute = '';
    const lenHourMM = lengthOfVisit.split(':');
    if (lenHourMM[0].length === 1) {
      hour = '0' + lenHourMM[0];
    } else {
      hour = lenHourMM[0];
    }
    if (lenHourMM[1].length === 1) {
      minute = '0' + lenHourMM[1];
    } else {
      minute = lenHourMM[1];
    }
    this.lenOfVisit = hour + ":" + minute;
  }

  onExitClicked() {
    this.location.back();
  }

  ngOnDestroy() {
    this.inPageNavService.setNavItems(null);
  }

}
