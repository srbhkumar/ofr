import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import{Template, Case, OFRResponse,Dashboard} from '../models/caseModel';
import{AppConfig} from '../../app.config'
import{PingCase} from '../models/pingcase';
import{MsalService} from './MsalService';

@Injectable()
export class DataService {
    private headers: Headers;
   
    
    constructor(private http: Http, private msal: MsalService, private config: AppConfig) {
        this.headers = new Headers();
    }

    private httpget<T>(action: string): Promise<T> {
        this.appendToken();
        return this.http
            .get(this.config.getConfig("rootUrl") + action, { headers: this.headers })
            .toPromise()
            .then(res => res.json() as T)
            .catch(this.handleError);
    }

    private httppost<T>(action:string,body:any):Promise<T>
    {
        this.appendToken();

        return this.http
            .post(this.config.getConfig("rootUrl") + action, body, { headers: this.headers })
            .toPromise()
            .then(res => res.json() as T)
            .catch(this.handleError);
    }

    public getGroups():Promise<void>
    {
        return this.httpget<string>('/user/groups/' + this.msal.getUser()).then(function(groups){
            localStorage.setItem("GroupAccess", groups);
        });
    }

    public getAccess():Promise<any>
    {
        return this.msal.updateToken();

    }
    private appendToken()
    {
        this.msal.updateToken();
        this.headers.set("Username", this.msal.getUsername());
        this.headers.set('Authorization', 'Bearer ' + this.msal.getAccessToken());
        this.headers.set("GroupAccess", localStorage.getItem("GroupAccess"));   
    }

    public getDashboard():Promise<Dashboard>
    {
        //return this.httpget<Dashboard>('/dashboard?code=wcRKuW6TpHd47/98eOlnx38wVixZBJJ5T9cDzn6U4F7NcAkqeYj6TQ==');

        return this.httpget<Dashboard>('/case/');
    } 


    public getCaseCount(casetype: string):Promise<number>
    {
        return this.httpget<number>(`/case/count/${casetype}`);
    }


    public getOpenCases(page:number, size:number, flaggedOnly: boolean):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/case/page/${page}/open?flaggedOnly=${flaggedOnly}&size=${size}`);
       
    } 

    public getAvailableCases(page:number, size:number, flaggedOnly: boolean):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/case/page/${page}/available?flaggedOnly=${flaggedOnly}&size=${size}`);
       
    } 

     public getDismissedCases(page:number, size:number, flaggedOnly: boolean):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/case/page/${page}/dismissed?flaggedOnly=${flaggedOnly}&size=${size}`);
       
    }

    public getSubmittedCases(page:number, size:number, flaggedOnly: boolean):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/case/page/${page}/submitted?flaggedOnly=${flaggedOnly}&size=${size}`);
       
    } 
    

    public getTemplate(id:string):Promise<any>
    {
        return this.httpget<any>(`/template/${id}`);
    } 

    public getCaseInformation(id:string):Promise<Case>
    {
        return this.httpget<Case>(`/case/${id}`);
    }

    public saveCase(id:string, data:any):Promise<OFRResponse>
    {
     
        return this.httppost<OFRResponse>(`/case/${id}`, data);
    } 
    
    public submitCase(id:string, data:any):Promise<OFRResponse>
    { 
        return this.httppost<OFRResponse>(`/case/${id}/submit`, data);
    }

    public uploadFiles(files: Array<any>)
    {
        let headers = new Headers();
        this.appendToken();
        if (files.length > 0) {
        let formData: FormData = new FormData();
        for (let file of files) {
             formData.append('files', file, file.name);
        }
        
        headers.set('Accept', 'text/csv');
        let options = new RequestOptions({ headers: headers });
        this.httppost<string>(`/ocme/upload/web`, formData)
            .then(res => {alert("Successfully Uploaded File")})
            .catch(this.handleError);
        }
    }

    public updateCaseStatus(id:string, newStatus:any):Promise<OFRResponse>
    {
        return this.httppost<OFRResponse>(`/case/${id}/${newStatus}/updatestatus`, {});
    }
 
    public PingCase(id: string): Promise<PingCase> {
        return this.httppost<PingCase>(`/case/${id}/ping`, {});
    }

    public DownloadCases(startDateDeath: string, endDateDeath: string, startDateReview: string, endDateReview, type: string): Promise<string>{
        return this.httpget<string>(`/case/download/cases?startDateDeath=${startDateDeath}&endDateDeath=${endDateDeath}&startDateReview=${startDateReview}&endDateReview=${endDateReview}&type=${type}`);
        
    }
 
    private handleError(error: any) {
        alert('An error occurred\n' + error.json());
        return Promise.reject(error.message || error);
    }
}
