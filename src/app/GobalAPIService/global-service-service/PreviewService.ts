import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PreviewService {
    previewList: any = [];
    fileData: any;
    selecteProcessIdList: any;
    selectedallContactList: any = [];
    selecteCampaignIdList: any;
    selectedCampaignIdListRouting: any;
    selectedroutingList: any = [];

    historyFlg: any;
    ViewCampaignList: any;
    count: number;
    commingFrom: any;
    campaignRouting: any;
    loginFlag: boolean;

    constructor() {
    }

    set setloginFlag(val: boolean) {
        this.loginFlag = val;
    }
    get getloginFlag() {
        return this.loginFlag;
    }

    set setCount(val: number) {
        this.count = val;
    }
    get getCount() {
        return this.count;
    }

    set setcommingFrom(val: object) {
        this.commingFrom = val;
    }
    get getcommingFrom() {
        return this.commingFrom;
    }

    set sethistoryFlg(val: object) {
        this.historyFlg = val;
    }
    get gethistoryFlg() {
        return this.historyFlg;
    }


    set setcampaignRouting(val: object) {
        this.campaignRouting = val;
    }
    get getcampaignRouting() {
        return this.campaignRouting;
    }

    set setselectedallContactList(val: object) {
        this.selectedallContactList = val;
    }
    get getselectedallContactList() {
        return this.selectedallContactList;
    }

    set setViewCampaignList(val: object) {
        this.ViewCampaignList = val;
    }
    get getViewCampaignList() {
        return this.ViewCampaignList;
    }

    set setPreviewList(val: object) {
        this.previewList = val;
    }
    get getPreviewList() {
        return this.previewList;
    }

    set setFileData(val: object) {
        this.fileData = val;
    }
    get getFileData() {
        return this.fileData;
    }
    set setProcessList(val: object) {
        this.selecteProcessIdList = val;
    }
    get getProcessList() {
        return this.selecteProcessIdList;
    }

    set setCampaignList(val: object) {
        this.selecteCampaignIdList = val;
    }
    get getCampaignList() {
        return this.selecteCampaignIdList;
    }
    // routinfg data
    set setselectedCampaignIdListRouting(val: object) {
        this.selectedCampaignIdListRouting = val;
    }
    get grtselectedCampaignIdListRouting() {
        return this.selectedCampaignIdListRouting;
    }

    set setselectedroutingList(val: object) {
        this.selectedroutingList = val;
    }
    get getselectedroutingList() {
        return this.selectedroutingList;
    }

}