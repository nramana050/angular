import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseUrl } from "src/app/framework/constants/url-constants";
@Injectable({
    providedIn: 'root'
})
export class GenaieService {

    constructor(private readonly http: HttpClient) { }
    getKeyState() {
        const href = `${BaseUrl.GENAIE}/courseRequest/keyState`;
        return this.http.get<any>(href);
    }
   
    getLaunguage()
    {
        const href = `${BaseUrl.GENAIE}/courseRequest/language`;
        return this.http.get<any>(href);
    }

    getVoice(id){
        const href = `${BaseUrl.GENAIE}/courseRequest/voice/${id}`;
        return this.http.get<any>(href);
    }
    createCourse(payload)
    {
        const href = `${BaseUrl.GENAIE}/courseRequest/create`;
        return this.http.post<any>(href,payload);
    }
    getCoursesRequest(id){
      const href = `${BaseUrl.GENAIE}/courseRequest/getOutline/${id}`;
      return this.http.get<any>(href);
    }
    saveCourseAsDraft(payload){
      const href = `${BaseUrl.GENAIE}/courseRequest/updateOutline`;
      return this.http.put<any>(href , payload);
    }
    saveAndGenerateCourse(payload){
    const href = `${BaseUrl.GENAIE}/courseRequest/lesson`;
    return this.http.post<any>(href,payload);
   }

   getLessonRequest(id,defaultLanguage) {
    const href = `${BaseUrl.GENAIE}/courseRequest/getLesson/${id}`;
    return this.http.get<any>(href,{
      params: new HttpParams().set("lcode",defaultLanguage)
    });
  }

  saveLessonAsDraft(payload){
    const href = `${BaseUrl.GENAIE}/courseRequest/updateLesson`;
    return this.http.put<any>(href , payload);
  }
  
  publishCourse(id){
    const href = `${BaseUrl.GENAIE}/courseRequest/generate/${id}`;
    return this.http.get<any>(href);
  }

  publish(id) {
    const href = `${BaseUrl.GENAIE}/course/publish/${id}`;
    return this.http.get<any>(href);
  }

  assetGeneration(payload) {
    const href = `${BaseUrl.GENAIE}/course/generateAsset`;
    return this.http.post<any>(href,payload);
  }
  
  generateLanguages(payload){
    const href = `${BaseUrl.GENAIE}/translate`;
    return this.http.post<any>(href,payload);
  }

  selectedLanguagesData(courseId){
    const href = `${BaseUrl.GENAIE}/translate/selectedLanguages/${courseId}`;
    return this.http.get<any>(href);
  }

  getCourseLessonStatus(id,stageType) {
    const href = `${BaseUrl.GENAIE}/translate/getLessonStatus/${id}/${stageType}`;
    return this.http.get<any>(href);
  }

  getCourseStatus(id) {
    const href = `${BaseUrl.GENAIE}/courseRequest/courseStatus/${id}`;
    return this.http.get<any>(href);
  }
  getExportType() {
    const href = `${BaseUrl.GENAIE}/export/refExport`;
    return this.http.get<any>(href); 
   }

   export(payload) {
    const href = `${BaseUrl.GENAIE}/export`;
    return this.http.post(href, payload);
   }

  getTranslatedLanguageList(id) {
    const href = `${BaseUrl.GENAIE}/translate/${id}`;
    return this.http.get<any>(href);
  }

  retryCourse(payload, type) {
    const href = `${BaseUrl.GENAIE}/retry/${type}`;
    return this.http.post<any>(href, payload);
  }

  retryCourseStage(payload): Observable<any> {
    const href = `${BaseUrl.GENAIE}/retry`;
    return this.http.post<any>(href, payload)
}


  deleteCourse(payload){
    const href = `${BaseUrl.GENAIE}/courseRequest/deleteCourse`;
    return this.http.post<any>(href,payload);
  }

  getCourseApproveStatus(courseRequestId) {
    const href = `${BaseUrl.GENAIE}/courseRequest/getApproveStatus/${courseRequestId}`;
      return this.http.get<any>(href)
    }

  approveCourse(courseRequestId) {
    const href = `${BaseUrl.GENAIE}/courseRequest/approveCourse`;
    const payload = { "courseRequestId": courseRequestId }
    return this.http.put<any>(href,payload)
  }

  generateLearningOutcome(payload) {
    const href = `${BaseUrl.GENAIE}/outcome`;
    return this.http.post<any>(href, payload);
  }

  saveLearningOutcomesAsDraft(payload) {
    const href = `${BaseUrl.GENAIE}/outcome`;
    return this.http.put<any>(href, payload);
  }
 
  getH5pTypeList() {
    const href = `${BaseUrl.GENAIE}/h5p`;
    return this.http.get<any>(href);
  }

  getLicenceDetails(): Observable<any> {
    const href = `${BaseUrl.GENAIE}/course/getLicenseCount`;
    return this.http.get<any>(href)
  }

  getReferenceDataByDomain(domainName):Observable<any>{
    const href = `${BaseUrl.GENAIE}/ref-data-choice/refData/${domainName}`;
    return this.http.get<any>(href)

  }

  getSasUrl(courseRequestId, fileName): Observable<any> {
    const href = `${BaseUrl.GENAIE}/uploadImage/getSasUrl?courseRequestId=${courseRequestId}&fileName=${fileName}`;
    return this.http.get<any>(href)
  }
}
