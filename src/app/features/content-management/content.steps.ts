import { Injectable } from '@angular/core';

@Injectable()
export class ContentManagementSteps {

    stepsConfig = [
        {
            name: 'Description',
            state: '/content-management/content',
            id: 'D',
            featureId: [13]
        },
        {
            name: 'Teams',
            state: '/content-management/establishment',
            id: 'T',
            featureId: [13]
        },
        {
            name: 'Category',
            state: '/content-management/category',
            id: 'C',
            featureId: [13]
        },
        {
            name: 'Image',
            state: '/content-management/image',
            id: 'I',
            featureId: [13]
        },
        {
            name: 'Upload',
            state: '/content-management/upload',
            id: 'U',
            featureId: [13]
        }
    ]
    stepsConfig2 = [
        {
            name: 'Description',
            state: '/rws-content-management/content',
            id: 'D',
            featureId: [142]
        },
        {
            name: 'Programme',
            state: '/rws-content-management/establishment',
            id: 'T',
            featureId: [142]
        },
        {
            name: 'Category',
            state: '/rws-content-management/category',
            id: 'C',
            featureId: [142]
        },
        {
            name: 'Image',
            state: '/rws-content-management/image',
            id: 'I',
            featureId: [142]
        },
        {
            name: 'Upload',
            state: '/rws-content-management/upload',
            id: 'U',
            featureId: [142]
        }
    ];
}