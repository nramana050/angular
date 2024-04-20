import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { BaseUrl } from "src/app/GobalAPIService/url-constants";
@Injectable({
    providedIn: 'root'
})
export class padhaiService {

    constructor(private readonly http: HttpClient) { }

    dataServiceSubject = new Subject<any>();
    newImageUploadedSubject = new BehaviorSubject<boolean>(false);
    courseImageSubject = new Subject<any>();
    courseOutlineSuccessSubject = new Subject<any>();

    getKeyState() {
        const href = `${BaseUrl.padhai}/courseRequest/keyState`;
        return this.http.get<any>(href);
    }
   
    getLaunguage()
    {
        const href = `${BaseUrl.padhai}/courseRequest/language`;
        return this.http.get<any>(href);
    }

    getVoice(id){
        const href = `${BaseUrl.padhai}/courseRequest/voice/${id}`;
        return this.http.get<any>(href);
    }
    createCourse(payload)
    {
        const href = `${BaseUrl.padhai}/courseRequest/create`;
        return this.http.post<any>(href,payload);
    }
    getCoursesRequest(id){
      const href = `${BaseUrl.padhai}/courseRequest/getOutline/${id}`;
      return this.http.get<any>(href);
    }
    saveCourseAsDraft(payload){
      const href = `${BaseUrl.padhai}/courseRequest/updateOutline`;
      return this.http.put<any>(href , payload);
    }
    saveAndGenerateCourse(payload){
    const href = `${BaseUrl.padhai}/courseRequest/lesson`;
    return this.http.post<any>(href,payload);
   }

   getLessonRequest(id,defaultLanguage) {
    const href = `${BaseUrl.padhai}/courseRequest/getLesson/${id}`;
    return this.http.get<any>(href,{
      params: new HttpParams().set("lcode",defaultLanguage)
    });
  }

  saveLessonAsDraft(payload){
    const href = `${BaseUrl.padhai}/courseRequest/updateLesson`;
    return this.http.put<any>(href , payload);
  }
  
  publishCourse(id){
    const href = `${BaseUrl.padhai}/courseRequest/generate/${id}`;
    return this.http.get<any>(href);
  }

  publish(id) {
    const href = `${BaseUrl.padhai}/course/publish/${id}`;
    return this.http.get<any>(href);
  }

  assetGeneration(payload) {
    const href = `${BaseUrl.padhai}/course/generateAsset`;
    return this.http.post<any>(href,payload);
  }
  
  generateLanguages(payload){
    const href = `${BaseUrl.padhai}/translate`;
    return this.http.post<any>(href,payload);
  }

  selectedLanguagesData(courseId){
    const href = `${BaseUrl.padhai}/translate/selectedLanguages/${courseId}`;
    return this.http.get<any>(href);
  }

  getCourseLessonStatus(id,stageType) {
    const href = `${BaseUrl.padhai}/translate/getLessonStatus/${id}/${stageType}`;
    return this.http.get<any>(href);
  }

  getCourseStatus(id) {
    const href = `${BaseUrl.padhai}/courseRequest/courseStatus/${id}`;
    return this.http.get<any>(href);
  }
  getExportType() {
    const href = `${BaseUrl.padhai}/export/refExport`;
    return this.http.get<any>(href); 
   }

   export(payload) {
    const href = `${BaseUrl.padhai}/export`;
    return this.http.post(href, payload);
   }

  getTranslatedLanguageList(id) {
    const href = `${BaseUrl.padhai}/translate/${id}`;
    return this.http.get<any>(href);
  }

  retryCourse(payload, type) {
    const href = `${BaseUrl.padhai}/retry/${type}`;
    return this.http.post<any>(href, payload);
  }

  retryCourseStage(payload): Observable<any> {
    const href = `${BaseUrl.padhai}/retry`;
    return this.http.post<any>(href, payload)
}


  deleteCourse(payload){
    const href = `${BaseUrl.padhai}/courseRequest/deleteCourse`;
    return this.http.post<any>(href,payload);
  }

  getCourseApproveStatus(courseRequestId) {
    const href = `${BaseUrl.padhai}/courseRequest/getApproveStatus/${courseRequestId}`;
      return this.http.get<any>(href)
    }

  approveCourse(courseRequestId) {
    const href = `${BaseUrl.padhai}/courseRequest/approveCourse`;
    const payload = { "courseRequestId": courseRequestId }
    return this.http.put<any>(href,payload)
  }

  generateLearningOutcome(payload) {
    const href = `${BaseUrl.padhai}/outcome`;
    return this.http.post<any>(href, payload);
  }

  saveLearningOutcomesAsDraft(payload) {
    const href = `${BaseUrl.padhai}/outcome`;
    return this.http.put<any>(href, payload);
  }
 
  getH5pTypeList() {
    const href = `${BaseUrl.padhai}/h5p`;
    return this.http.get<any>(href);
  }

  getLicenceDetails(): Observable<any> {
    const href = `${BaseUrl.padhai}/course/getLicenseCount`;
    return this.http.get<any>(href)
  }

  getReferenceDataByDomain(domainName):Observable<any>{
    const href = `${BaseUrl.padhai}/ref-data-choice/refData/${domainName}`;
    return this.http.get<any>(href)

  }

  getSasUrl(courseRequestId, fileName): Observable<any> {
    const href = `${BaseUrl.padhai}/uploadImage/getSasUrl?courseRequestId=${courseRequestId}&fileName=${fileName}`;
    return this.http.get<any>(href)
  }
}
