using Newtonsoft.Json;
using OfrApi.Interfaces;
using OfrApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace OfrApi.Services
{
    public class PDMPDal : IPDMPDal
    {
        public string PdmpHost { get; set; }
        public string ByEidEndpoint { get; set; }
        public string CdsNumber { get; set; }
        public string OrgName { get; set; }
        public string LookupEndpoint { get; set; }
        public string LookupHost { get; set; }

        public PDMPDal(){
            PdmpHost = WebConfigurationManager.AppSettings["PDMPEndpoint"];
            ByEidEndpoint = WebConfigurationManager.AppSettings["ByEIDPath"];
            CdsNumber = WebConfigurationManager.AppSettings["CDSNumber"];
            OrgName = WebConfigurationManager.AppSettings["OrgName"];
            LookupHost = WebConfigurationManager.AppSettings["LookupHost"];
            LookupEndpoint = WebConfigurationManager.AppSettings["LookupEndpoint"];
        }
        public async Task<PDMPData> GetPDMPData(string username, string eid)
        {

            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"{ByEidEndpoint}?userName={username}&eid={eid}&organizationName={OrgName}"))
            {
                request.Headers.Add("OrgName", OrgName);
                if(!string.IsNullOrEmpty(CdsNumber))
                    request.Headers.Add("CdsNumber", CdsNumber);
               
                using (var httpClient = new HttpClient() { BaseAddress = new Uri(PdmpHost) })
                {
                    var response = await httpClient.SendAsync(request);
                    if (!response.IsSuccessStatusCode)
                    {
                        return new PDMPData
                        {
                            Notice = response.ReasonPhrase,
                            IsRegistered = true,
                            Results = { }
                        };
                    }

                    var body = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<PDMPData>(body);
                }
            }
                
           
        }
        public async Task<string> GetEid(string username, LookupRequest lookupDetails)
        {
            using (HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, $"{LookupEndpoint}"))
            {
                request.Headers.Add("UserName", username);
                request.Headers.Add("OrgName", OrgName);
                if(!string.IsNullOrEmpty(CdsNumber))
                    request.Headers.Add("CdsNumber", CdsNumber);
                request.Content = new StringContent(JsonConvert.SerializeObject(lookupDetails), Encoding.UTF8, "application/json");
                using (var httpClient = new HttpClient() { BaseAddress = new Uri(LookupHost) })
                {
                    var response = await httpClient.SendAsync(request);
                    if (!response.IsSuccessStatusCode)
                    {
                        return null;
                    }

                    var body = await response.Content.ReadAsStringAsync();

                    //Gets the Eid of the result with the highest score
                    //A seed is passed into Aggregate to avoid it operating on an empty set.
                    return JsonConvert.DeserializeObject<LookupResult>(body).Results.Aggregate(new EidResult(), (resultA, resultB) => int.Parse(resultA.Score) > int.Parse(resultB.Score) ? resultA : resultB).EnterpriseId;
                }              
            }
        }
    }
}