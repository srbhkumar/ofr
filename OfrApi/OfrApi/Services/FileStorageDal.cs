using System;
using System.Web.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.File;
using OfrApi.Interfaces;

namespace OfrApi.Services
{
    public class FileStorageDal : IFileStorageDal
    {
        private const string ContentType = "text/plain";
        private CloudFileShare CloudFileShare { get; }

        public FileStorageDal()
        {
            var storageAccountConnection = WebConfigurationManager.AppSettings["storageAccountConnection"];
            var fileShareName = WebConfigurationManager.AppSettings["fileShareName"];
            var storageAccount = CloudStorageAccount.Parse(storageAccountConnection);
            var fileClient = storageAccount.CreateCloudFileClient();
            CloudFileShare = fileClient.GetShareReference(fileShareName);
        }

        public Uri GetFileUri(string fileName)
        {
            var file = GetCloudFile(fileName);

            var sharedAccessSignature = file.GetSharedAccessSignature(new SharedAccessFilePolicy()
            {
                Permissions = SharedAccessFilePermissions.Read,
                SharedAccessExpiryTime = DateTime.UtcNow.AddHours(1)
            });

            return new Uri(file.StorageUri.PrimaryUri.ToString() + sharedAccessSignature);
        }

        public void DeleteFile(string fileName)
        {
            var file = GetCloudFile(fileName);

            file.Delete();
        }

        private CloudFile GetCloudFile(string fileName)
        {
            if (!CloudFileShare.Exists())
                throw new FileStorageException($"File share '{CloudFileShare.Name}' does not exist");


            var file = CloudFileShare.GetRootDirectoryReference().GetFileReference(fileName);

            if (!file.Exists())
                throw new FileStorageException($"File '{fileName}' does not exist in file share '{CloudFileShare.Name}'");

            return file;
        }
    }
}