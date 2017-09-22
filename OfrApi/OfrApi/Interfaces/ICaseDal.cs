using System;
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

        Case GetCaseById(string id, HttpRequestMessage request);
        IEnumerable<Case> GetCasesByPage(int page, CaseStatus status, HttpRequestMessage request);
        object PingCaseById(string id, HttpRequestMessage request);
        void PostCaseById(string id, HttpRequestMessage request);
        void UpdateStatusById(string id, CaseStatus status, HttpRequestMessage request);
        void UploadCase(Case caseObj);
        void SubmitCase(string id, HttpRequestMessage request);
        List<Case> DownloadCases(DateTime dateTime1, DateTime dateTime2, HttpRequestMessage request);
        int GetCaseCount(CaseStatus status, HttpRequestMessage request);
    }
}