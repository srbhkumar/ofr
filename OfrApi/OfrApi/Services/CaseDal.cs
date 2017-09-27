using Microsoft.Azure.Documents;
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
        private IUserDal _userDal;
        public IUserDal UserDal
        {
            get { return _userDal ?? (_userDal = new UserDal()); }
            set { _userDal = value; }
        }

        public CaseDal()
        {
            string endpoint = WebConfigurationManager.AppSettings["StorageEndpoint"];
            string primarykey = WebConfigurationManager.AppSettings["DocumentPrimaryKey"];

            Client = new DocumentClient(new Uri(endpoint), primarykey);
        }

        public Case GetCaseById(string id, HttpRequestMessage request)
        {
            List<string> jurisdictions = _userDal.GetGroupsFromHeader(request);
            
            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };

            var caseById = Client.CreateDocumentQuery<Case>(
                UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                feedOptions)
                .Where(c => (c.id == id && (jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains(c.Data["ResidentCounty"]) || jurisdictions.Contains("Admin")))).AsEnumerable().FirstOrDefault();
            
            return caseById;
            
        }

        public void UpdateStatusById(string id, CaseStatus status, HttpRequestMessage request)
        {
            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };
            var caseById = Client.CreateDocumentQuery<Case>(
            UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
            feedOptions)
            .Where(c => c.id == id)
            .AsEnumerable().FirstOrDefault();
            var keyValue = caseById.Jurisdiction;

            var result = Client.ExecuteStoredProcedureAsync<object>(
                UriFactory.CreateStoredProcedureUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"], "SetCaseStatus"),
                new RequestOptions { PartitionKey = new PartitionKey(keyValue) },
                id,
                status.ToString()
            ).Result;
               
        }

        public void SubmitCase(string id, HttpRequestMessage request)
        {
            var username = UserDal.GetUserNameFromHeader(request);
           
      
            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };
            var caseById = Client.CreateDocumentQuery<Case>(
            UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
            feedOptions)
            .Where(c => c.id == id)
            .AsEnumerable().FirstOrDefault();
            var keyValue = caseById.Jurisdiction;

            var result = Client.ExecuteStoredProcedureAsync<object>(
                UriFactory.CreateStoredProcedureUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"], "SubmitCase"),
                new RequestOptions { PartitionKey = new PartitionKey(keyValue) },
                id,
                username
            ).Result;
             
        }

        //Not sure about the future status of this one
        public object PingCaseById(string id, HttpRequestMessage request)
        {
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
            
            var username = request.Headers.GetValues("Username").First();

            var response = Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri("OFR", "Cases", "PingCase"),
                id);
            return response;

        }

        public void PostCaseById(string id, HttpRequestMessage request)
        {
            // Get request body
            dynamic data = request.Content.ReadAsAsync<object>();

            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };
            var caseById = Client.CreateDocumentQuery<Case>(
            UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
            feedOptions)
            .Where(c => c.id == id)
            .AsEnumerable().FirstOrDefault();
            var keyValue = caseById.Jurisdiction;


            this.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"], "MergeCase"),
                new RequestOptions { PartitionKey = new PartitionKey(keyValue) },
                id,
                data.Result);

 
        }

        public IEnumerable<Case> GetCasesByPage(int page, CaseStatus status, HttpRequestMessage request)
        {
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
            
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
                .Where(c => (c.Status == status.ToString() && (jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains(c.Data["ResidentCounty"]) || jurisdictions.Contains("Admin"))))
                .OrderBy(c => c.Data["DateofDeath"])
                .Take(skipCount + takeCount)
                .ToArray()
                .Skip(skipCount);
            
            return cases;
   
        }

        public void UploadCase(Case newCase)
        {

            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };



            var caseById = Client.CreateDocumentQuery<Case>(
            UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
            feedOptions)
            .Where(c => c.OCME == newCase.OCME).AsEnumerable().FirstOrDefault();

            if (caseById == null)
            {
                var cases = Client.UpsertDocumentAsync(UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]), newCase).Result;
            }
           
        }


        public List<Case> DownloadCases(DateTime startDate, DateTime endDate, HttpRequestMessage request)
        {
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
            var end = endDate.ToString("yyyy-MM-dd");
            var start = startDate.ToString("yyyy-MM-dd");

            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };

            var cases = Client.CreateDocumentQuery<Case>(
                UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                feedOptions)
                .Where(c => ((jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains(c.Data["ResidentCounty"]) || jurisdictions.Contains("Admin")) && c.Data["DateofDeath"].CompareTo(end) <= 0 && c.Data["DateofDeath"].CompareTo(start) >= 0))
                .ToList<Case>();

            return cases;
        }

        public int GetCaseCount(CaseStatus status, HttpRequestMessage request)
        {
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };
            var count = Client.CreateDocumentQuery<Case>(
                UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                feedOptions)
                .Where(c => ((jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains(c.Data["ResidentCounty"]) || jurisdictions.Contains("Admin")) && c.Status == status.ToString()))
                .ToList<Case>().Count;
            return count;
        }
    }
}