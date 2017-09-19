using System;
using System.IO;
using System.Threading;
using System.Web.Configuration;

using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using OfrApi.Interfaces;

namespace OfrApi.Services
{
    public class BlobStorageDal : IBlobStorageDal
    {
        private const string ContentType = "text/plain";
        private CloudBlobContainer CloudBlobContainer { get; }

        public BlobStorageDal()
        {
            var storageAccountConnection = WebConfigurationManager.AppSettings["storageAccountConnection"];
            var blobContainerName = WebConfigurationManager.AppSettings["blobContainerName"];
            CloudBlobContainer = GetCloudBlobContainer(storageAccountConnection, blobContainerName);
        }

        private CloudBlobContainer GetCloudBlobContainer(string storageAccountConnection, string blobContainerName)
        {
            var storageAccount = CloudStorageAccount.Parse(storageAccountConnection);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var blobContainer = blobClient.GetContainerReference(blobContainerName);

            if (blobContainer.CreateIfNotExists())
                blobContainer.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

            return blobContainer;
        }

        public bool UploadFromStream(string fileName, Stream sourceStream)
        {
            try
            {
                var blockBlob = CloudBlobContainer.GetBlockBlobReference(fileName);
                blockBlob.Properties.ContentType = ContentType;
                blockBlob.UploadFromStream(sourceStream);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool UploadFromText( string fileName, string source)
        {
            try
            {
                var blockBlob = CloudBlobContainer.GetBlockBlobReference(fileName);
                blockBlob.Properties.ContentType = ContentType;
                blockBlob.UploadText(source);

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public void UploadFromUri(string fileName, Uri sourceUri)
        {
            var blockBlob = CloudBlobContainer.GetBlockBlobReference($"{fileName}");
            var x = 2;
            while (blockBlob.Exists())
            {
                blockBlob = CloudBlobContainer.GetBlockBlobReference($"{fileName}_{x}");
                x++;
            }

            blockBlob.Properties.ContentType = ContentType;
            blockBlob.StartCopyAsync(sourceUri).Wait();

            // wait for copy to complete up to 6000 times, waiting 50 miliseconds each time
            // 50 * 6000 miliseconds = 300000 miliseconds = 5 minutes
            x = 0;
            while (blockBlob.CopyState.Status == CopyStatus.Pending && x < 6000)
            {
                Thread.Sleep(50);
                blockBlob.FetchAttributes();
                x++;
            }

            if (blockBlob.CopyState.Status != CopyStatus.Success)
            {
                throw new BlobStorageException($"Failed to copy {fileName} from file storage to blob");
            }
        }

        public string DownloadBlob(string filename)
        {
            return "";
        }
    }
}