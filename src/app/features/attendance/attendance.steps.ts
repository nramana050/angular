import { Injectable } from '@angular/core';

@Injectable()
export class AttendanceSteps {

    stepsConfig = [
        {
            name: 'Session Attendance',
            state: '/attendance/list/session',
            id: 'A',
            pathMatch: 'full'
        },
        {
            name: 'Interruptions',
            state: '/attendance/list/interruption',
            id: 'I',
            pathMatch: 'full'
        }
    ];
}