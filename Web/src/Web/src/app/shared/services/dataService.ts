import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import{Template} from '../../case/ofr';
import{Dashboard} from '../models/dashboard';

@Injectable()
export class DataService {
    data: Object;
    private rootUrl = "https://crispofr.azure-api.net/api/";
    private headers: Headers;
    constructor(private http: Http) {
        this.headers = new Headers();
        this.headers.append("Ocp-Apim-Subscription-Key", "69c8009e9b974124b76d1dad24afb75f");
    }

    private httpget<T>(action: string): Promise<T> {
        return this.http
            .get(this.rootUrl + action, { headers: this.headers })
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

    private handleError(error: any) {
        // todo: display errors to the user (sometimes)
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

     public getCaseItems() {
        return this.http.get('https://crispofr.azure-api.net/api/template/2691e182-04d3-4499-9a89-14bb531bc770', this.generateHeaders())
        .map((response: Response) => response.json());
    }

    private generateHeaders() {
        let headers: Headers = new Headers();
        headers.append('Ocp-Apim-Subscription-Key', '69c8009e9b974124b76d1dad24afb75f');

        let opts: RequestOptions = new RequestOptions();
        opts.headers = headers;

        return opts;
    }
}
