import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import{Template, Case, OFRResponse,Dashboard} from '../models/caseModel';
import {Constant} from '../utility/constants';
import{PingCase} from '../models/pingcase';

@Injectable()
export class DataService {
    constant: Constant;
    private headers: Headers;
   
    
    constructor(private http: Http) {
        this.constant = new Constant();
        this.headers = new Headers();
        //this.headers.append(this.constant.headerSubscriptionKey, this.constant.headerSubscriptionValue);  
        this.headers.append('Username', 'Rock'); //Temporery code. Once SSO is implemented we'll make it dynamic.
    }

    public setAuthentication(token:string):void
    {
        this.headers.append("Authentication", token);
    }

    private httpget<T>(action: string): Promise<T> {
        return this.http
            .get(this.constant.rootUrl + action, { headers: this.headers })
            .toPromise()
            .then(res => res.json() as T)
            .catch(this.handleError);
    }

    private httppost<T>(action:string,body:any):Promise<T>
    {
        return this.http
            .post(this.constant.rootUrl + action, body, { headers: this.headers })
            .toPromise()
            .then(res => res.json() as T)
            .catch(this.handleError);
    }

    public getDashboard():Promise<Dashboard>
    {
        //return this.httpget<Dashboard>('/dashboard?code=wcRKuW6TpHd47/98eOlnx38wVixZBJJ5T9cDzn6U4F7NcAkqeYj6TQ==');
        return this.httpget<Dashboard>('/dashboard');
    } 

    public getOpenCases(page:number):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/opencases/${page}`);
       
    } 

    public getAvailableCases(page:number):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/availablecases/${page}`);
       
    } 

     public getDismissedCases(page:number):Promise<Dashboard>
    {
        return this.httpget<Dashboard>(`/dismissedcases/${page}`);
       
    } 
    

    public getTemplate(id:string):Promise<Template>
    {
        return this.httpget<Template>(`/template/${id}?code=NoDHzZb8vajzRtZSfRJm40VDALjVZQ60IfLje0J7qn16sOmsvXHvAg==`);
    } 

    public getCaseInformation(id:string):Promise<Case>
    {
        return this.httpget<Case>(`/case/${id}?code=d4T3BVwlduK9fFDcdtWjB4klXYS84B5ptNj3coZTQ5ulNsAdykjp1w==`);
    }

    public saveCase(id:string, data:any):Promise<OFRResponse>
    {
     
        return this.httppost<OFRResponse>(`/case/${id}?code=7Oa0NJFoifqddtJLQeyBjv7nOXRq/3EnDvVqmpsun9KkehaYCbgxAA==`, data);
    } 
    
    public submitCase(id:string, data:any):Promise<OFRResponse>
    {
        return this.httppost<OFRResponse>(`/submit/${id}`, data);
    }

    public updateCaseStatus(id:string, newStatus:any):Promise<OFRResponse>
    {
        return this.httppost<OFRResponse>(`/status/${id}/${newStatus}?code=DdDhm1YEHMkJn13a7AuFYaFbrU5kaBhPcVn1Cu/POq0yDYUs3rBNiQ==`, {});
    }
 
    public PingCase(id: string): Promise<PingCase> {
        return this.httppost<PingCase>(`/ping/${id}?code=aBAAa3pLY8TGSmnivFajbn4A7a0j6hTJ/yYw5fwVOUqG/XRJ4b9W9w==`, {});
    }
 
    private handleError(error: any) {
        // todo: display errors to the user (sometimes)
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
