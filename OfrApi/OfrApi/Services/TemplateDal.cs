using Microsoft.Azure.Documents.Client;
using OfrApi.Models;
using System;
using System.Linq;
using System.Net.Http;
using System.Web.Configuration;

namespace OfrApi.Controllers
{
    public class TemplateDal : ITemplateDal
    {
        public DocumentClient Client { get; protected set; }

        public TemplateDal()
        {
            string endpoint = WebConfigurationManager.AppSettings["StorageEndpoint"];
            string primarykey = WebConfigurationManager.AppSettings["DocumentPrimaryKey"];

            Client = new DocumentClient(new Uri(endpoint), primarykey);
        }

        public CaseTemplate getTemplate(string id, HttpRequestMessage request)
        {
            var c = Client.CreateDocumentQuery<CaseTemplate>(UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["templateCollection"]))
                .Where(d => d.id == id);

            return c.AsEnumerable().FirstOrDefault() ;
           
        } 

        public string GetCurrentTemplate()
        {
            var c = Client.CreateDocumentQuery<CaseTemplate>(UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["templateCollection"]))
                .OrderBy(f => f._ts);

            return c.AsEnumerable().FirstOrDefault().id;

        }

    }
}