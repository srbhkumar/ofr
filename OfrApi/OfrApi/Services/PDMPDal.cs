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
            try
            {
                var endpoint = WebConfigurationManager.AppSettings["PDMPEndpoint"];
                var sourceMRNPath = WebConfigurationManager.AppSettings["SourceMRNPath"];
                var cdsNumber = WebConfigurationManager.AppSettings["CDSNumber"];

                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"{sourceMRNPath}/OCME/{MRN}");
                request.Headers.Add("UserName", username);
                request.Headers.Add("OrgName", "OCME");
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
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}