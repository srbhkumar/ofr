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
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
            
            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };

            var caseById = Client.CreateDocumentQuery<Case>(
                UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                feedOptions)
                .Where(c => (c.id == id && (jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains("Admin")))).AsEnumerable().FirstOrDefault();
            
            return caseById;
            
        }

        public void UpdateStatusById(string id, CaseStatus status, string username, HttpRequestMessage request)
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
                status.ToString(),
                username
            ).Result;
               
        }

        public void SubmitCase(string id, string username,  HttpRequestMessage request)
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

        public void PostCaseById(string id, string username, HttpRequestMessage request)
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


            var result = this.Client.ExecuteStoredProcedureAsync<object>(UriFactory.CreateStoredProcedureUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"], "MergeCase"),
                new RequestOptions { PartitionKey = new PartitionKey(keyValue) },
                id,
                data.Result,
                username).Result;

 
        }

        public Tuple<int,List<Case>> GetCasesByPage(int page, CaseStatus status, int size, bool flaggedOnly, HttpRequestMessage request)
        {
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
           
            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };



            var skipCount = (page - 1) * size;
            var takeCount = size;

            //Although these appear to be repeated queries they are done in this way because they are executed remotely (on cosmosdb) and we
            //do not want to retrieve all cases with their full data in order to count them
            var cases = Client.CreateDocumentQuery<Case>(
                UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                feedOptions)
                .Where(c => (c.Status == status.ToString() && (jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains("Admin")) && (!flaggedOnly || c.Flagged)))
                .OrderBy(c => c.Data["DateofDeath"])
                .Take(skipCount + takeCount)
                .ToArray()
                .Skip(skipCount);

            var count = Client.CreateDocumentQuery<Case>(
                UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                feedOptions)
                .Where(c => (c.Status == status.ToString() &&(jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains("Admin")) &&  (!flaggedOnly || c.Flagged)))
                .ToList<Case>().Count;

            return new Tuple<int, List<Case>>(count, cases.ToList<Case>());
   
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
            .Where(c => c.OCME == newCase.OCME && c.Jurisdiction == newCase.Jurisdiction).AsEnumerable().FirstOrDefault();

            if (caseById == null)
            {
                var cases = Client.UpsertDocumentAsync(UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]), newCase).Result;
            }
           
        }


        public List<Case> DownloadCases(DateTime? startDateDeath, DateTime? endDateDeath, DateTime? startDateReview, DateTime? endDateReview, HttpRequestMessage request)
        {
            List<string> jurisdictions = UserDal.GetGroupsFromHeader(request);
            

            var feedOptions = new FeedOptions
            {
                EnableCrossPartitionQuery = true,
                MaxItemCount = -1,
                EnableScanInQuery = true
            };

            List<Case> cases;

            if (startDateDeath != null && endDateDeath != null && startDateReview != null && endDateReview != null)
            { 
                var endDeath = endDateDeath.Value.ToString("yyyy-MM-dd");
                var startDeath = startDateDeath.Value.ToString("yyyy-MM-dd");
                var endReview = endDateReview.Value.ToString("yyyy-MM-dd");
                var startReview = startDateReview.Value.ToString("yyyy-MM-dd");
                cases = Client.CreateDocumentQuery<Case>(
                    UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                    feedOptions)
                    .Where(c => ((jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains("Admin")) && 
                                c.Data["DateofDeath"].CompareTo(endDeath) <= 0 && c.Data["DateofDeath"].CompareTo(startDeath) >= 0 &&
                                c.Data["DateofInitialCaseReview"].CompareTo(endReview) <= 0 && c.Data["DateofInitialCaseReview"].CompareTo(startReview) >= 0)).ToList<Case>();
            }
            else if(startDateDeath != null && endDateDeath != null)
            {
                var endDeath = endDateDeath.Value.ToString("yyyy-MM-dd");
                var startDeath = startDateDeath.Value.ToString("yyyy-MM-dd");
                cases = Client.CreateDocumentQuery<Case>(
                    UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                    feedOptions)
                    .Where(c => ((jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains("Admin")) &&
                                c.Data["DateofDeath"].CompareTo(endDeath) <= 0 && c.Data["DateofDeath"].CompareTo(startDeath) >= 0)).ToList<Case>();
            }
            else if(startDateReview != null && endDateReview != null)
            {
                var endReview = endDateReview.Value.ToString("yyyy-MM-dd");
                var startReview = startDateReview.Value.ToString("yyyy-MM-dd");
                cases = Client.CreateDocumentQuery<Case>(
                    UriFactory.CreateDocumentCollectionUri(WebConfigurationManager.AppSettings["documentDatabase"], WebConfigurationManager.AppSettings["caseCollection"]),
                    feedOptions)
                    .Where(c => ((jurisdictions.Contains(c.Jurisdiction) || jurisdictions.Contains("Admin")) &&
                                c.Data["DateofInitialCaseReview"].CompareTo(endReview) <= 0 && c.Data["DateofInitialCaseReview"].CompareTo(startReview) >= 0)).ToList<Case>();
            }
            else
            {
                cases = new List<Case>();
            }
            return cases;
        }
    }
}