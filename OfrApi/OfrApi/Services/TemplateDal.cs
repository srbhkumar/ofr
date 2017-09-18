using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Azure.Documents.Client;
using OfrApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;

namespace OfrApi.Controllers
{
    public class TemplateDal
    {
        public DocumentClient Client { get; protected set; }
        public TelemetryClient TelClient { get; protected set; }

        public TemplateDal()
        {
            string endpoint = WebConfigurationManager.AppSettings["StorageEndpoint"];
            string primarykey = WebConfigurationManager.AppSettings["DocumentPrimaryKey"];

            Client = new DocumentClient(new Uri(endpoint), primarykey);


            TelemetryConfiguration.Active.InstrumentationKey = WebConfigurationManager.AppSettings["InstrumentationKey"];
            TelClient = new TelemetryClient();
        }

        public CaseTemplate getTemplate(string id, HttpRequestMessage request)
        {
            using (var op = TelClient.StartOperation<RequestTelemetry>("GetTemplate"))
            {
                op.Telemetry.ResponseCode = "200";
                op.Telemetry.Url = request.RequestUri;

                var c = Client.CreateDocumentQuery<CaseTemplate>(UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["templateCollection"]))
                    .Where(d => d.id == id);

                return c.AsEnumerable().FirstOrDefault() ;
            }
        } 
    }
}