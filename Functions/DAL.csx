using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;

// Not really a data access layer, don't have a better name.
public class DAL
{
    public static DocumentClient CreateClient()
    {
        string endpoint = System.Configuration.ConfigurationManager.AppSettings["StorageEndpoint"];
        string primkey = System.Configuration.ConfigurationManager.AppSettings["StoragePrimKey"];

        return new DocumentClient(
            new Uri(endpoint), primkey
        );
    }
}