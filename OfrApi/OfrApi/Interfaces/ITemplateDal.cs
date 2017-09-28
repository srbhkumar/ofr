using System.Net.Http;
using Microsoft.Azure.Documents.Client;
using OfrApi.Models;

namespace OfrApi.Controllers
{
    public interface ITemplateDal
    {
        DocumentClient Client { get; }

        string GetCurrentTemplate();
        CaseTemplate getTemplate(string id, HttpRequestMessage request);
    }
}