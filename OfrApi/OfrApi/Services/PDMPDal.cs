using Newtonsoft.Json;
using OfrApi.Interfaces;
using OfrApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace OfrApi.Services
{
    public class PDMPDal : IPDMPDal
    {
        public async Task<PDMPData> GetPDMPData(string username, string MRN)
        {
                var endpoint = WebConfigurationManager.AppSettings["PDMPEndpoint"];
                var sourceMRNPath = WebConfigurationManager.AppSettings["SourceMRNPath"];
                var cdsNumber = WebConfigurationManager.AppSettings["CDSNumber"];
                var orgName = WebConfigurationManager.AppSettings["OrgName"];
                var sourceCode = WebConfigurationManager.AppSettings["Source"];
                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"{sourceMRNPath}?SourceCode={sourceCode}&MRNnumber={MRN}");
                request.Headers.Add("UserName", username);
                request.Headers.Add("OrgName", orgName);
                if(!string.IsNullOrEmpty(cdsNumber))
                    request.Headers.Add("CdsNumber", cdsNumber);
               
                using (var httpClient = new HttpClient() { BaseAddress = new Uri(endpoint) })
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
}