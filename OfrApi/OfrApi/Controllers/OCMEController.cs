using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
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
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;

namespace OfrApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/ocme")]
    public class OCMEController : BaseController
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
        private IUserDal _userDal;
        public IUserDal UserDal
        {
            get { return _userDal ?? (_userDal = new UserDal()); }
            set { _userDal = value; }
        }

        private ICaseDal _caseDal;
        public ICaseDal CaseDal
        {
            get { return _caseDal ?? (_caseDal = new CaseDal()); }
            set { _caseDal = value; }
        }
        private ITemplateDal _templateDal;
        public ITemplateDal TemplateDal
        {
            get { return _templateDal ?? (_templateDal = new TemplateDal()); }
            set { _templateDal = value;  }
        }
        

        public OCMEController()
        {
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



                try
                {
                    fileName = CopyFileToBlob(fileName);
                    ocmeData = BlobDal.DownloadBlob(fileName);
                    operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                    operation.Telemetry.Url = Request.RequestUri;


                    ParseAndUpload(ocmeData);


                    BlobDal.MoveFileToProcessed(fileName);
                    return Request.CreateResponse(HttpStatusCode.OK);


                }
                catch (Exception ex)
                {
                    BlobDal.MoveFileToPoison(fileName);
                    return HandleExceptions(ex, operation, Request);
                }

            }
        }
        [HttpPost, Route("upload/web")]
        public async Task<HttpResponseMessage> Upload()
        {
            var groups = UserDal.GetGroupsFromHeader(Request);
            if (!groups.Contains("Admin"))
                return Request.CreateResponse(HttpStatusCode.Unauthorized, "You do not have permission to upload files.");
            using (var operation = this.TelClient.StartOperation<RequestTelemetry>("UploadFromSite"))
            {
                
                if (!Request.Content.IsMimeMultipartContent())
                    throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

                var provider = new MultipartMemoryStreamProvider();
                await Request.Content.ReadAsMultipartAsync(provider);
                foreach (var file in provider.Contents)
                {
                    string filename = null;
                    try
                    {
                        operation.Telemetry.ResponseCode = HttpStatusCode.OK.ToString();
                        operation.Telemetry.Url = Request.RequestUri;
                        var buffer = await file.ReadAsByteArrayAsync();
                        var contents = System.Text.Encoding.UTF8.GetString(buffer);
                        filename = BlobDal.UploadFromText("ocme" + DateTime.Now.ToString(@"yyyy-MM-dd"), contents);
                        ParseAndUpload(contents);
                        BlobDal.MoveFileToProcessed(filename);
                    }
                    catch (Exception ex)
                    {
                        if (!string.IsNullOrEmpty(filename))
                            BlobDal.MoveFileToPoison(filename);
                        return HandleExceptions(ex, operation, Request);
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, "Success");
            }
               
        }


        private void ParseAndUpload(string fileContents)
        {


            //Convert the string to the individual entries
            //Handles both Unix and Windows new lines
            List<string> entries = new List<string>(fileContents.Split(new string[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries));

            //Excel defaults to outputting rows of all commas so this handles that
            //This strips all rows that have only commas
            Regex r = new Regex(@"[^\\,]");
            entries.RemoveAll(e => !r.IsMatch(e));

            //Pull out the header to its own list and extract key data
            //Convert to using a map stored with indicies so everything can be remapped

            var header = new List<string>(entries[0].Split(','));
            entries.RemoveAt(0);

            //Strip whitespace from all fields in header
            for (int i = 0; i < header.Count; i++)
            {
                header[i] = string.Concat(header[i].Where(c => !char.IsWhiteSpace(c)));
            }

            var template = TemplateDal.GetCurrentTemplate();
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
                CaseDal.UploadCase(tempCase);

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
