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
        private CloudBlobContainer PoisonContainer { get; }
        private CloudBlobContainer ProcessedContainer { get; }

        public BlobStorageDal()
        {
            var storageAccountConnection = WebConfigurationManager.AppSettings["storageAccountConnection"];
            var blobContainerName = WebConfigurationManager.AppSettings["blobContainerName"];
            var blobProcessedName = WebConfigurationManager.AppSettings["blobProcessedName"];
            var blobPoisonName = WebConfigurationManager.AppSettings["blobPoisonName"];
            CloudBlobContainer = GetCloudBlobContainer(storageAccountConnection, blobContainerName);
            PoisonContainer = GetCloudBlobContainer(storageAccountConnection, blobPoisonName);
            ProcessedContainer = GetCloudBlobContainer(storageAccountConnection, blobProcessedName);
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

        public string UploadFromUri(string fileName, Uri sourceUri)
        {
            var blockBlob = CloudBlobContainer.GetBlockBlobReference($"{fileName}");
            var x = 1;
            while (blockBlob.Exists())
            {
                x++;
                blockBlob = CloudBlobContainer.GetBlockBlobReference($"{fileName}_{x}");
            }

            

            blockBlob.Properties.ContentType = ContentType;
            blockBlob.StartCopyAsync(sourceUri).Wait();

            // wait for copy to complete up to 6000 times, waiting 50 miliseconds each time
            // 50 * 6000 miliseconds = 300000 miliseconds = 5 minutes
            var i = 0;
            while (blockBlob.CopyState.Status == CopyStatus.Pending && i < 6000)
            {
                Thread.Sleep(50);
                blockBlob.FetchAttributes();
                i++;
            }

            if (blockBlob.CopyState.Status != CopyStatus.Success)
            {
                throw new BlobStorageException($"Failed to copy {fileName} from file storage to blob");
            }
            if (x > 1)
                return $"{fileName}_{x}";
            else
                return fileName;
        }

        public string DownloadBlob(string filename)
        {
            var blockBlob = CloudBlobContainer.GetBlockBlobReference($"{filename}");
            return blockBlob.DownloadText();
        }

        public void MoveFileToPoison(string filename)
        {
            var poisonReference = PoisonContainer.GetBlockBlobReference(filename);
            var rawReference = CloudBlobContainer.GetBlockBlobReference(filename);
            poisonReference.StartCopy(rawReference);
            rawReference.Delete();
        }

        public void MoveFileToProcessed(string filename)
        {
            var processedReference = ProcessedContainer.GetBlockBlobReference(filename);
            var rawReference = CloudBlobContainer.GetBlockBlobReference(filename);
            processedReference.StartCopy(rawReference);
            rawReference.Delete();
        }
    }
}