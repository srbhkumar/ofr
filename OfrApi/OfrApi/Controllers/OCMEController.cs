using OfrApi.Interfaces;
using OfrApi.Models;
using OfrApi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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

        [HttpPost, Route("api/upload"), AllowAnonymous]
        public IHttpActionResult Upload([FromBody] UploadedFile uploadedFile)
        {
            if (uploadedFile == null || string.IsNullOrWhiteSpace(uploadedFile.Url) || string.IsNullOrWhiteSpace(uploadedFile.Name))
                return BadRequest("Request must contain Url and Name");

            var fileShareName = WebConfigurationManager.AppSettings["fileShareName"];

            // the incoming url will look like this:
            // "azure://<accountname>:<accesskey>@file.core.windows.net/<sharename>/<username>/<filename>"
            var urlSplit = uploadedFile.Url.Split('/');

            if (urlSplit.Length < 3 ||
                !urlSplit[urlSplit.Length - 3].Equals(fileShareName, StringComparison.InvariantCultureIgnoreCase) ||
                !urlSplit[urlSplit.Length - 1].Equals(uploadedFile.Name))
            {
                return BadRequest("Request's Url does not match request's Name or does not contain expected file share name");
            }

            var userName = urlSplit[urlSplit.Length - 2];
            var fileName = urlSplit[urlSplit.Length - 1];

            try
            {
                CopyFileToBlob(userName, fileName);
            }
            catch (FileStorageException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (BlobStorageException ex)
            {
                return InternalServerError(ex);
            }
            return Ok();
        }

        private void CopyFileToBlob(string username, string filename)
        {
            var uri = FileDal.GetFileUri(username, filename);
            BlobDal.UploadFromUri(username, filename, uri);
            FileDal.DeleteFile(username, filename);
        }
    }
}
