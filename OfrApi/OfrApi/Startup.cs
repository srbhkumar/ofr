using Microsoft.Owin.Security.OAuth;
using Owin;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Web.Http;
using OfrApi.App_Start;
using Microsoft.Owin.Security.Jwt;
using System.Web.Http.Cors;

namespace OfrApi
{
    public class Startup
    {
        public static string aadInstance = ConfigurationManager.AppSettings["ida:AadInstance"];
        public static string tenant = ConfigurationManager.AppSettings["ida:Tenant"];
        public static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
        public static string signUpSignInPolicy = ConfigurationManager.AppSettings["ida:SignUpSignInPolicyId"];
        public static string defaultPolicy = signUpSignInPolicy;

        public void Configuration(IAppBuilder app)
        {
            //Doesn't seem to ever work
            //Currently just set in web config, but should be modified to only allow calls from our specific web app 
            //app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
                
            HttpConfiguration config = new HttpConfiguration();
            ConfigureOAuth(app);
            config.EnableCors(new EnableCorsAttribute("*", "*", "GET, POST, OPTIONS, PUT, DELETE"));
            WebApiConfig.Register(config);
            app.UseWebApi(config);
        }

        public void ConfigureOAuth(IAppBuilder app)
        {
            app.UseOAuthBearerAuthentication(CreateBearerOptionsFromPolicy(signUpSignInPolicy));
        }

        private OAuthBearerAuthenticationOptions CreateBearerOptionsFromPolicy(string policy)
        {
            TokenValidationParameters temp = new TokenValidationParameters
            {
                // Accept only those tokens where the audience of the token is equal to the client ID of this app
                ValidAudience = clientId,
                AuthenticationType = policy,
            };

            return new OAuthBearerAuthenticationOptions
            {
                // This SecurityTokenProvider fetches the Azure AD B2C metadata & signing keys from the OpenIDConnect metadata endpoint
                AccessTokenFormat = new JwtFormat(temp, new OpenIdConnectCachingSecurityTokenProvider(string.Format(aadInstance, tenant, policy)))
            };
        }
    }
}