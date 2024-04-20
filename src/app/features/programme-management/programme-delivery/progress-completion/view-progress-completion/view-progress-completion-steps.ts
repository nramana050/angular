import { Injectable } from '@angular/core';

@Injectable()
export class ViewProgressCompletionSteps {

    stepsConfig = [
        {
            name: 'Course Details',
            state: '/programme-management/programme-delivery/view-progress-completion/course-details',
            id: 'C',
            featureId: [50]
        },
        {
            name: 'Programme Details',
            state: '/programme-management/programme-delivery/view-progress-completion/programme-details',
            id: 'P',
            featureId: [50]
        }
    ];
}
