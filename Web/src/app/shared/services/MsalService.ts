import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AppConfig} from '../../app.config'
//import '../../../../node_modules/msal/out/msal';
/// <reference path="../../../../node_modules/msal/out/msal.d.ts" />
var jwt = require('jwt-simple');
declare var bootbox: any;
declare var Msal: any;

@Injectable()


export class MsalService {
    access_token: string;
    tenantConfig: any;
    authority: any;
    clientApplication: any;

    constructor(private config: AppConfig) {
    this.tenantConfig = {
        tenant: config.getConfig("b2cTenant"),
        clientID: config.getConfig("b2cClientId"),
        signUpSignInPolicy: config.getConfig("b2cPolicy"),
        b2cScopes: config.getConfig("b2cScopes")
    };

    // Configure the authority for Azure AD B2C

    this.authority = "https://login.microsoftonline.com/tfp/" + this.tenantConfig.tenant + "/" + this.tenantConfig.signUpSignInPolicy;

    /*
     * B2C SignIn SignUp Policy Configuration
     * 
     */
    this.clientApplication = new Msal.UserAgentApplication(
        this.tenantConfig.clientID, this.authority,  
        function (errorDesc: any, token: any, error: any, tokenType: any) {            
            if (errorDesc && (<string>errorDesc).startsWith('AADB2C90118')) {
                localStorage.setItem('AccessDenied', 'true');
            }
            else if (token) {
                localStorage.setItem('IdToken', token);
            }
        });
    }

    login(): void {
        localStorage.clear();
        this.clientApplication.loginRedirect([this.tenantConfig.clientID]);
    }

    updateToken():Promise<any>{

       
        return  this.clientApplication.acquireTokenSilent(this.tenantConfig.b2cScopes, null, this.clientApplication.getUser()).then(function (accessToken) {
                localStorage.setItem('AccessToken', accessToken);
                
            }, function (error) {
                this.clientApplication.acquireTokenPopup(this.tenantConfig.b2cScopes, null, this.clientApplication.getUser()).then(function (accessToken) {
                    localStorage.setItem('AccessToken', accessToken);
                }, function (error) {

                });
        });
    }

    getAccessToken(): string{
        return localStorage.getItem('AccessToken');
    }
    logout(): void {
        localStorage.clear();
        this.clientApplication.logout();
    };

    getUser(): string { 
        var idToken = localStorage.getItem("IdToken");
        var segments = idToken.split('.');
        var payload = atob(segments[1]);
        var oid = JSON.parse(payload).oid;

        return oid;
    }

    getUserName(): string {
        var idToken = localStorage.getItem("IdToken");
        var segments = idToken.split('.');
        var payload = atob(segments[1]);
        var username = JSON.parse(payload).name;
        return username;
    }

    isOnline(): boolean {
        return this.clientApplication.getUser() != null;
    };
}