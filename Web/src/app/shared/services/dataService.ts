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
        this.headers.append(this.constant.headerSubscriptionKey, this.constant.headerSubscriptionValue);  
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
        return this.httpget<Dashboard>('/dashboard');
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

    public PingCase(id: string): Promise<PingCase> {
        return this.httppost<PingCase>(`/ping/${id}`, {});
    }

    private handleError(error: any) {
        // todo: display errors to the user (sometimes)
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
