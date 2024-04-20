import { Injectable } from "@angular/core";

@Injectable()
export class ViewLernerStapes {
    stepsConfig = [
        {
            name: 'Learner Info',
            state: '/learners/view-learner',
            id: 'I',
            featureId: [9]

        },
        {
            name: 'Learner Enrolment',
            state: '/learners/enrolment-details',
            id: 'E',
            featureId: [50]
        },
        {
            name: 'Outcomes',
            state: '/learners/learner-outcome',
            id: 'O',
            featureId: [50]
        }

    ];
}
