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
            string endpoint = "https://ofr-cosmos-dev.documents.azure.com:443/";// ConfigurationManager.AppSettings["StorageEndpoint"];
            string primkey = "sirTwP2K1VK4YgyIJ3wBkPfTgZmjsMU4xb4yzow3IYjNk2dS9ah2VZkYdhYZChxGgKW88pM33t5WE8eAFDLIuw=="; //ConfigurationManager.AppSettings["DocumentPrimKey"];

            Client = new DocumentClient(new Uri(endpoint), primkey);


            TelemetryConfiguration.Active.InstrumentationKey = "57ojou71xaefuwctvhy3kjhftm30djd2r43xajq7"; //ConfigurationManager.AppSettings["InstrumentationKey"];
            TelClient = new TelemetryClient();
        }
    }
}