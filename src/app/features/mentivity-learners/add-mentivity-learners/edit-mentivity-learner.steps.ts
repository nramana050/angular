import { Injectable } from '@angular/core';

@Injectable()
export class EditMentivityLeanerSteps {

    stepsConfig = [
        {
            name: 'Participant Info',
            state: '/mentivity-learner/edit-info',
            id: 'I',
             featureId: [99]
        }
       ,
        {
            name: 'Further Information',
            state: '/mentivity-learner/further-information',
            id: 'F',
            featureId: [100]

        },
        {
            name: 'Participant Enrolment',
            state: '/mentivity-learner/enrolment-details',
            id: 'E',
            featureId: [50]
        },
        {
            name: 'Outcomes',
            state: '/mentivity-learner/learner-outcome',
            id: 'O',
            featureId: [50]
        },
        
    ];
    
}
