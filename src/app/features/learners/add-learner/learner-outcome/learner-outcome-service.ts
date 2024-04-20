import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utility } from 'src/app/framework/utils/utility';
import { BaseUrl } from '../../../../framework/constants/url-constants';

@Injectable({
    providedIn: 'root'
})
export class LearnersOutcomeService {

    constructor(private readonly http: HttpClient) { }

    saveLearnerOutcome(payload) {
        payload.contactDate = Utility.dateToString(payload.contactDate);
        payload.startDate = Utility.dateToString(payload.startDate);
        const href = `${BaseUrl.COMPLY}/outcome`;
        return this.http.post<any>(href, payload);
    }

    updateLearnerOutcome(payload) {
        payload.contactDate = Utility.dateToString(payload.contactDate);
        payload.startDate = Utility.dateToString(payload.startDate);
        const href = `${BaseUrl.COMPLY}/outcome`;
        return this.http.put<any>(href, payload);
    }

    getUserRefData() {
        const href = `${BaseUrl.COMPLY}/outcome/refData`;
        return this.http.get<any>(href);
    }

    getUserOutcome(outcomeId) {
        const href = `${BaseUrl.COMPLY}/outcome/${outcomeId}`;
        return this.http.get<any>(href);
    }

    getUserEmployer() {
        const href = `${BaseUrl.COMPLY}/outcome/employer`;
        return this.http.get<any>(href);
    }

    getUserDeliveryData(did) {
        const href = `${BaseUrl.COMPLY}/outcome/deliveryData/${did}`;
        return this.http.get<any>(href);
    }

    deletLearnerOutcomeData(outcomeId) {
        const href = `${BaseUrl.COMPLY}/outcome/${outcomeId}`;
        return this.http.delete<any>(href);
    }

    getUserOutcomeDataOnDelivery(did, learnerId) {
        const href = `${BaseUrl.COMPLY}/outcome/deliveryOutcomeDetailsList`;
        let params = new HttpParams();
        params = params.append('learnerId', learnerId);
        params = params.append('programDeliveryId', did);
        return this.http.get<any>(href, { params: params });
    }

    getAllOutcomeDataOfUser(learnerId) {
        const href = `${BaseUrl.COMPLY}/outcome/learnerOutcomeList/${learnerId}`
        return this.http.get<any>(href);
    }

}
