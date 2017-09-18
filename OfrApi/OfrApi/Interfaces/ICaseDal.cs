using System.Collections.Generic;
using System.Net.Http;
using Microsoft.ApplicationInsights;
using Microsoft.Azure.Documents.Client;
using OfrApi.Models;
using OfrApi.Utilities;

namespace OfrApi.Interfaces
{
    public interface ICaseDal
    {
        DocumentClient Client { get; }
        TelemetryClient TelClient { get; }

        Case GetCaseById(string id, HttpRequestMessage request);
        IEnumerable<Case> GetCasesByPage(int page, CaseStatus status, HttpRequestMessage request);
        object PingCaseById(string id, HttpRequestMessage request);
        string PostCaseById(string id, HttpRequestMessage request);
        string SubmitCaseById(string id, HttpRequestMessage request);
    }
}