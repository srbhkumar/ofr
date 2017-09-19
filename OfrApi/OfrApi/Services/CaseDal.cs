using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Azure.Documents.Client;
using OfrApi.Interfaces;
using OfrApi.Models;
using OfrApi.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Configuration;

namespace OfrApi.Services
{
    public class CaseDal : ICaseDal
    {
        public DocumentClient Client { get; protected set; }
        public TelemetryClient TelClient { get; protected set; }

        public CaseDal()
        {
            string endpoint = WebConfigurationManager.AppSettings["StorageEndpoint"];
            string primarykey = WebConfigurationManager.AppSettings["DocumentPrimaryKey"];

            Client = new DocumentClient(new Uri(endpoint), primarykey);


            TelemetryConfiguration.Active.InstrumentationKey = WebConfigurationManager.AppSettings["InstrumentationKey"];
            TelClient = new TelemetryClient();
        }

        public Case GetCaseById(string id, HttpRequestMessage request)
        {
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("AvailableCasesDashboard"))
            {
                operation.Telemetry.ResponseCode = "200";
                operation.Telemetry.Url = request.RequestUri;
                var feedOptions = new FeedOptions
                {
                    EnableCrossPartitionQuery = true,
                    MaxItemCount = -1,
                    EnableScanInQuery = true
                };



                var caseById = Client.CreateDocumentQuery<Case>(
                UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                feedOptions)
                .Where(c => c.id == id);
                var currentCase = caseById.AsEnumerable().FirstOrDefault();
                return jurisdictions.Contains(currentCase.Jurisdiction) ? currentCase : null;
            }
        }

        //Not sure about the future status of this one
        public object PingCaseById(string id, HttpRequestMessage request)
        {
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
            using (var op = this.TelClient.StartOperation<RequestTelemetry>("Ping"))
            {
                op.Telemetry.ResponseCode = "200";
                op.Telemetry.Url = request.RequestUri;

                var username = request.Headers.GetValues("Username").First();

                var response = Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "PingCase"),
                    id);
                return response;
            }
        }

        public string PostCaseById(string id, HttpRequestMessage request)
        {
            //May end up verifying that the user has rights to post that case
            using (var op = this.TelClient.StartOperation<RequestTelemetry>("PostCase"))
            {
                op.Telemetry.ResponseCode = "200";
                op.Telemetry.Url = request.RequestUri;

                // Get request body
                dynamic data = request.Content.ReadAsAsync<object>();
                var feedOptions = new FeedOptions
                {
                    EnableCrossPartitionQuery = true,
                    MaxItemCount = -1,
                    EnableScanInQuery = true
                };
                this.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"], "MergeCase"),
                    id,
                    data
                );
                return "";
            }
            
        }

        public string SubmitCaseById(string id, HttpRequestMessage request)
        {
            using (var op = this.TelClient.StartOperation<RequestTelemetry>("Submit"))
            {
                op.Telemetry.ResponseCode = "200";
                op.Telemetry.Url = request.RequestUri;

                // todo: validation

                this.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "SubmitCase"),
                    id
                );

                // todo: emails

            }
            return "";
        }

        public IEnumerable<Case> GetCasesByPage(int page, CaseStatus status, HttpRequestMessage request)
        {
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("CasesDashboard"))
            {
                operation.Telemetry.ResponseCode = "200";
                operation.Telemetry.Url = request.RequestUri;
                var pageParam = page;
                var feedOptions = new FeedOptions
                {
                    EnableCrossPartitionQuery = true,
                    MaxItemCount = -1,
                    EnableScanInQuery = true
                };



                var skipCount = (pageParam - 1) * int.Parse(WebConfigurationManager.AppSettings["PageSize"]);
                var takeCount = int.Parse(WebConfigurationManager.AppSettings["PageSize"]);

                var cases = Client.CreateDocumentQuery<Case>(
                UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                feedOptions)
                .Where(c => (c.Status == status.ToString() && jurisdictions.Contains(c.Jurisdiction)))
                .Take(skipCount + takeCount)
                .ToArray()
                .Skip(skipCount);

                return cases;
            }
        }
    }
}