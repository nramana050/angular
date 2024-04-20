import { Injectable } from '@angular/core';

@Injectable()
export class EditCaptrLeanerSteps {

    stepsConfig = [
        {
            name: 'Participant Info',
            state: '/captr-learner/edit-learner',
            id: 'I',
            featureId: [9]
        },
        {
            name: 'Further Information',
            state: '/captr-learner/further-information',
            id: 'F',
            featureId: [60]
        },
        {
            name: 'Participant Enrolment',
            state: '/captr-learner/enrolment-details',
            id: 'E',
            featureId: [50]
        },
        {
            name: 'Outcomes',
            state: '/captr-learner/learner-outcome',
            id: 'O',
            featureId: [50]
        },
  
    ];
    
}
