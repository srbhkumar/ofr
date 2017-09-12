import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import '../../../../node_modules/msal/out/msal';
/// <reference path="../../../../node_modules/msal/out/msal.d.ts" />
declare var bootbox: any;
declare var Msal: any;

@Injectable()


export class MsalService {
    access_token: string;
    tenantConfig = {
        tenant: "ofrdev.onmicrosoft.com",
        clientID: "b132f819-f134-4418-98e3-97d09be72856",
        signUpSignInPolicy: "B2C_1_sign-up-policy",
        b2cScopes: ["https://ofrdev.onmicrosoft.com/api/case"],
    };

    // Configure the authority for Azure AD B2C

    authority = "https://login.microsoftonline.com/tfp/" + this.tenantConfig.tenant + "/" + this.tenantConfig.signUpSignInPolicy;

    /*
     * B2C SignIn SignUp Policy Configuration
     * 
     */
    clientApplication = new Msal.UserAgentApplication(
        this.tenantConfig.clientID, this.authority);

    login(): void {
        this.clientApplication.loginRedirect([this.tenantConfig.clientID]);
    }

    updateToken(){

        Promise.all(
            this.clientApplication.acquireTokenSilent(this.tenantConfig.b2cScopes, null, this.clientApplication.getUser()).then(function (accessToken) {
                localStorage.setItem('AccessToken', accessToken);
                
            }, function (error) {
                this.clientApplication.acquireTokenPopup(this.tenantConfig.b2cScopes, null, this.clientApplication.getUser()).then(function (accessToken) {
                    localStorage.setItem('AccessToken', accessToken);
                }, function (error) {
                    alert("Error acquiring the access token to call the Web api:\n" + error);
                });
        }));
    }

    getAccessToken(): string{
        return localStorage.getItem('AccessToken');
    }
    logout(): void {
        this.clientApplication.logout();
    };

    isOnline(): boolean {
        return this.clientApplication.getUser() != null;
    };
}