import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import{Template, Case, OFRResponse,Dashboard} from '../models/caseModel';
import {Constant} from '../utility/constants';
import{PingCase} from '../models/pingcase';
import{MsalService} from './MsalService';

@Injectable()
export class DataService {
    constant: Constant;
    private headers: Headers;
   
    
    constructor(private http: Http, private msal: MsalService) {
        this.constant = new Constant();
        this.headers = new Headers();

    }

    private httpget<T>(action: string): Promise<T> {
        this.appendToken();

        return this.http
            .get(this.constant.rootUrl + action, { headers: this.headers })
            .toPromise()
            .then(res => res.json() as T)
            .catch(this.handleError);
    }

    private httppost<T>(action:string,body:any):Promise<T>
    {
        this.appendToken();

        return this.http
            .post(this.constant.rootUrl + action, body, { headers: this.headers })
            .toPromise()
            .then(res => res.json() as T)
            .catch(this.handleError);
    }

    public appendToken()
    {
        this.msal.updateToken();
        if (!this.headers.has("Authorization")) {
            this.headers.delete("Authorization");
            this.headers.append('Authorization', 'Bearer ' + this.msal.getAccessToken());
        }
    }

    public getDashboard():Promise<Dashboard>
    {
        //return this.httpget<Dashboard>('/dashboard?code=wcRKuW6TpHd47/98eOlnx38wVixZBJJ5T9cDzn6U4F7NcAkqeYj6TQ==');

        return this.httpget<Dashboard>('/case');
    } 

    public getOpenCases(page:number):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/case/page/${page}/open`);
       
    } 

    public getAvailableCases(page:number):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/case/page/${page}/available`);
       
    } 

     public getDismissedCases(page:number):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/case/page/${page}/dismissed`);
       
    }

    public getSubmittedCases(page:number):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/case/page/${page}/submitted`);
       
    } 
    

    public getTemplate(id:string):Promise<Template>
    {
        return this.httpget<Template>(`/template/${id}`);
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

    public updateCaseStatus(id:string, newStatus:any):Promise<OFRResponse>
    {
        return this.httppost<OFRResponse>(`/case/${id}/${newStatus}/updatestatus`, {});
    }
 
    public PingCase(id: string): Promise<PingCase> {
        return this.httppost<PingCase>(`/case/${id}/ping`, {});
    }
 
    private handleError(error: any) {
        // todo: display errors to the user (sometimes)
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
