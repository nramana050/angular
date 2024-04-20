import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseUrl } from '../../../app/framework/constants/url-constants';
import { IAppFeatures } from './AppFeatures';
@Injectable({
    providedIn: 'root'
})
export class AppFeaturesService {

    constructor(
        private readonly http: HttpClient,
    ) { }

    getAppFeatures() {
        const href =  `${BaseUrl.AUTHENTICATE}/menuDetails`;
         return this.http.get<IAppFeatures[]>(href);
    }
}