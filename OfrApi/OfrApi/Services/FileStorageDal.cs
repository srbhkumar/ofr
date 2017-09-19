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

        public Uri GetFileUri(string directoryName, string fileName)
        {
            var file = GetCloudFile(directoryName, fileName);

            var sharedAccessSignature = file.GetSharedAccessSignature(new SharedAccessFilePolicy()
            {
                Permissions = SharedAccessFilePermissions.Read,
                SharedAccessExpiryTime = DateTime.UtcNow.AddHours(1)
            });

            return new Uri(file.StorageUri.PrimaryUri.ToString() + sharedAccessSignature);
        }

        public void DeleteFile(string directoryName, string fileName)
        {
            var file = GetCloudFile(directoryName, fileName);

            file.Delete();
        }

        private CloudFile GetCloudFile(string directoryName, string fileName)
        {
            if (!CloudFileShare.Exists())
                throw new FileStorageException($"File share '{CloudFileShare.Name}' does not exist");

            var dir = CloudFileShare.GetRootDirectoryReference().GetDirectoryReference(directoryName);

            if (!dir.Exists())
                throw new FileStorageException($"Directory '{directoryName}' does not exist in file share '{CloudFileShare.Name}'");

            var file = dir.GetFileReference(fileName);

            if (!file.Exists())
                throw new FileStorageException($"File '{fileName}' does not exist in directory '{directoryName}' in file share '{CloudFileShare.Name}'");

            return file;
        }
    }
}