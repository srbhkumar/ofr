using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Azure.Documents.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace OfrApi.Services
{
    public class Dal
    {
        public static DocumentClient Client { get; protected set; }
        public static TelemetryClient TelClient { get; protected set; }

        static Dal()
        {
            //string endpoint = ConfigurationManager.AppSettings["DocumentEndpoint"];
            //string primkey = ConfigurationManager.AppSettings["DocumentPrimKey"];

            //Client = new DocumentClient(new Uri(endpoint), primkey);


            //TelemetryConfiguration.Active.InstrumentationKey = ConfigurationManager.AppSettings["InstrumentationKey"];
            //TelClient = new TelemetryClient();
        }
    }
}