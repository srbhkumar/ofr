using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json;
using OfrApi.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace OfrApi.Services
{
    public class UserDal : IUserDal
    {
        private string tenant;
        private AuthenticationContext authContext;
        private ClientCredential credential;

        public UserDal()
        {
            var clientId = WebConfigurationManager.AppSettings["b2c:ClientId"];
            var clientSecret = WebConfigurationManager.AppSettings["b2c:ClientSecret"];
            tenant = WebConfigurationManager.AppSettings["b2c:Tenant"];

            authContext = new AuthenticationContext("https://login.microsoftonline.com/" + tenant);
            credential = new ClientCredential(clientId, clientSecret);
        }

        public async Task<string> GetGroupsById(string userId)
        {
            string graphApi = WebConfigurationManager.AppSettings["b2c:GraphAPI"];
            string graphApiVersion = WebConfigurationManager.AppSettings["b2c:GraphApiVersion"];

            Task<AuthenticationResult> result = authContext.AcquireTokenAsync(graphApi, credential);

            var http = new HttpClient();
            string url = $"{graphApi}/{tenant}/users/{userId}/memberOf?api-version={graphApiVersion}";

       

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", result.Result.AccessToken);
            Task<HttpResponseMessage> response = http.SendAsync(request);

            if (!response.Result.IsSuccessStatusCode)
            {
                string error = await response.Result.Content.ReadAsStringAsync();
                object formatted = JsonConvert.DeserializeObject(error);
                return result.Result.AccessToken;
            }
            var jsonData = await response.Result.Content.ReadAsStringAsync();
            var groupMatches = Regex.Matches(jsonData, "\"displayName\":\"([\\w ]*)\"");
            var groups = "";
            foreach (Match group in groupMatches)
            {
                groups += "," + group.Groups[1].Value; 
            }
            if (!string.IsNullOrEmpty(groups))
            {
                groups = groups.Substring(1, groups.Length - 1);
            }
            

            return groups;
        }

        public static List<string> GetGroupsFromHeader(HttpRequestMessage request)
        {
            var groupHeader = String.Join("",request.Headers.GetValues("GroupAccess"));
            return new List<string>(EncryptionService.Decrypt(groupHeader).Split(','));
        }

        public static string GetUserNameFromHeader(HttpRequestMessage request)
        {
            return String.Join("", request.Headers.GetValues("Username"));
        }
    }
}