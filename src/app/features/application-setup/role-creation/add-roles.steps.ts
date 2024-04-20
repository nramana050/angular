import { Injectable } from '@angular/core';

@Injectable()
export class AddRoleSteps {

    stepsConfig = [
        {
            name: 'Role creation',
            state: '/application-setup/role-creation/add-roles',
            id: '1',
            featureId: [79],
            enable: false,
            // queryParams: { step: 'role' }
        },
        {
            name: 'RBAC Permissions',
            state: '/application-setup/role-creation/rbac-permissions',
            id: '2',
            featureId: [79],
            enable: false,
            // queryParams: { step: 'rbac' }
        },
        {
            name: 'Role configuration',
            state: '/application-setup/role-creation/role-configuration',
            id: '3',
            featureId: [79],
            enable: false,
            // queryParams: { step: 'role-conf' }
        },
        {
            name: 'Overview',
            state: '/application-setup/role-creation/overview',
            id: '4',
            featureId: [79],
            enable: false,
            // queryParams: { step: 'overview' }
        }
    ];

}
