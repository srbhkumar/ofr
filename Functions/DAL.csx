using System.Configuration;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;

using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft​.ApplicationInsights​.DataContracts;

// Not really a data access layer, don't have a better name.
public class DAL
{
    public static DocumentClient Client { get; protected set; }
    public static TelemetryClient TC { get; protected set; }

    public static DAL()
    {
        string endpoint = "ConfigurationManager.AppSettings["StorageEndpoint"];
        string primkey = ConfigurationManager.AppSettings["StoragePrimKey"];

        Client = new DocumentClient(new Uri(endpoint), primkey);
        
        TelemetryConfiguration.Active.InstrumentationKey = ConfigurationManager.AppSettings["InstrumentationKey"];
        TC = new TelemetryClient();
    }
}