using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using OfrApi.Interfaces;
using OfrApi.Models;
using OfrApi.Services;
using OfrApi.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Configuration;
using System.Web.Http;

namespace OfrApi.Controllers
{
    [RoutePrefix("api/ocme")]
    public class OCMEController : ApiController
    {
        public class UploadedFile
        {
            public string Url { get; set; }
            public string Name { get; set; }
        }

        private IFileStorageDal _fileDal;
        public IFileStorageDal FileDal
        {
            get { return _fileDal ?? (_fileDal = new FileStorageDal()); }
            set { _fileDal = value; }
        }

        private IBlobStorageDal _blobDal;
        public IBlobStorageDal BlobDal
        {
            get { return _blobDal ?? (_blobDal = new BlobStorageDal()); }
            set { _blobDal = value; }
        }

        private ICaseDal _caseDal;
        private TemplateDal _templateDal;
        public TelemetryClient TelClient { get; protected set; }

        public OCMEController()
        {
            _caseDal = new CaseDal();
            _templateDal = new TemplateDal();
            TelClient = new TelemetryClient();
        }

        [HttpPost, Route("upload"), AllowAnonymous]
        public HttpResponseMessage Upload([FromBody] UploadedFile uploadedFile)
        {
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("Upload"))
            {
                if (uploadedFile == null || string.IsNullOrWhiteSpace(uploadedFile.Url) || string.IsNullOrWhiteSpace(uploadedFile.Name))
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "The file to be uploaded is empty");

                    var fileShareName = WebConfigurationManager.AppSettings["fileShareName"];

                    // the incoming url will look like this:
                    // "azure://<accountname>:<accesskey>@file.core.windows.net/<sharename>/<filename>"
                    var urlSplit = uploadedFile.Url.Split('/');

                    if (urlSplit.Length < 2 ||
                        !urlSplit[urlSplit.Length - 2].Equals(fileShareName, StringComparison.InvariantCultureIgnoreCase) ||
                        !urlSplit[urlSplit.Length - 1].Equals(uploadedFile.Name))
                    {
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Request's Url does not match request's Name or does not contain expected file share name");
                    }
                    string ocmeData;
                    var fileName = urlSplit[urlSplit.Length - 1];

                  
                    fileName = CopyFileToBlob(fileName);
                    ocmeData = _blobDal.DownloadBlob(fileName);
                try
                {
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    operation.Telemetry.Url = Request.RequestUri;

                    

                  
                    
                    //Convert the string to the individual entries
                    //Handles both Unix and Windows new lines
                    List<string> entries = new List<string>(ocmeData.Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries));

                    //Excel defaults to outputting rows of all commas so this handles that
                    //This strips all rows that have only commas
                    Regex r = new Regex(@"[^\\,]");
                    entries.RemoveAll(e => !r.IsMatch(e));

                    //Pull out the header to its own list and extract key data
                    //Convert to using a map stored with indicies so everything can be remapped

                    var header = new List<string>(entries[0].Split(','));
                    entries.RemoveAt(0);

                    var template = _templateDal.GetCurrentTemplate();
                    foreach (string entry in entries)
                    {
                        //Removes commas from fields that are enclosed in quotes
                        string result = Regex.Replace(entry, @",(?=[^""]*""(?:[^""]*""[^""]*"")*[^""]*$)", String.Empty);

                        //Removes quotes from within fields
                        result = result.Replace("\"", "");
                        List<string> data = new List<string>(result.Split(','));
                        var tempCase = HeaderMap.MapToCase(header, data);
                        tempCase.id = Guid.NewGuid().ToString();
                        tempCase.Status = CaseStatus.Available.ToString();
                        tempCase.Template = template;
                        tempCase.UpdatedOn = DateTime.Now;
                        _caseDal.UploadCase(tempCase);
                    }
                    _blobDal.MoveFileToProcessed(fileName);
                    return Request.CreateResponse(HttpStatusCode.OK);
                    

                }
                catch (Exception ex)
                {
                    _blobDal.MoveFileToPoison(fileName);
                    operation.Telemetry.ResponseCode = HttpStatusCode.InternalServerError.ToString();
                    var identifier = DateTime.Now.Ticks.ToString().Substring(8);
                    TelClient.TrackException(ex, new Dictionary<string, string> { { "id", identifier } });
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, "Error ID: " + identifier);
                }
            }
        }

        private string CopyFileToBlob(string filename)
        {
            var uri = FileDal.GetFileUri(filename);
            var newFilename = BlobDal.UploadFromUri(filename, uri);
            FileDal.DeleteFile(filename);
            return newFilename;
        }
    }
}
