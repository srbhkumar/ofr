import { Injectable } from '@angular/core';
import { Msal } '../../../../node_modules/msal/out/msal';
declare var bootbox: any;
declare var Msal: any;

@Injectable()


export class MsalService {
    access_token: string;

    tenantConfig = {
        tenant: "ofrdev.onmicrosoft.com",
        clientID: 'e2948675-750b-415f-be88-19f39e89283e',
        signUpSignInPolicy: "B2C_1_sign-up-policy",
        b2cScopes: ["https://AkereB2cTenantDev.onmicrosoft.com/demoapi/demo.read"]
    };

    // Configure the authority for Azure AD B2C

    authority = "https://login.microsoftonline.com/tfp/" + this.tenantConfig.tenant + "/" + this.tenantConfig.signUpSignInPolicy;

    /*
     * B2C SignIn SignUp Policy Configuration
     */
    clientApplication = new Msal.UserAgentApplication(
        this.tenantConfig.clientID, this.authority,
        function (errorDesc: any, token: any, error: any, tokenType: any) {            
            if (errorDesc && (<string>errorDesc).startsWith('AADB2C90118')) {
                localStorage.setItem('AccessDenied', 'true');
            }
            else if (token) {
                localStorage.setItem('token', token);
            }
        }
    );

    login(): void {
        this.clientApplication.loginRedirect(this.tenantConfig.b2cScopes).then(function (idToken: any) {
            this.clientApplication.acquireTokenSilent(this.tenantConfig.b2cScopes).then(
                function (accessToken: any) {
                    this.access_token = accessToken;
                }, function (error: any) {
                    this.clientApplication.acquireTokenPopup(this.tenantConfig.b2cScopes).then(
                        function (accessToken: any) {
                            this.access_token = accessToken;
                        }, function (error: any) {
                            alert("Error acquiring the popup:\n" + error);
                        });
                })
        }, function (error: any) {
            alert("Error during login:\n" + error);
        });
    }

    logout(): void {
        this.clientApplication.logout();
    };

    isOnline(): boolean {
        return this.clientApplication.getToken() != null;
    };
}