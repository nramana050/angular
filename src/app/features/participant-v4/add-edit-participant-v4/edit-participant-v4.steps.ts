import { Injectable } from '@angular/core';

@Injectable()
export class EditParticipantV4Steps {

    stepsConfig = [
        {
            name: 'Graduate Info',
            state: '/clink-learners/edit-learner',
            id: 'I',
             featureId: [113]
        }
       ,
        {
            name: 'Further Information',
            state: '/clink-learners/further-information',
            id: 'F',
            featureId: [117]

        },
    ];
    
}
