using System;
using System.IO;

namespace OfrApi.Interfaces
{
    public interface IBlobStorageDal
    {
        bool UploadFromStream(string accountName, string fileName, Stream sourceStream);
        bool UploadFromText(string accountName, string fileName, string source);
        void UploadFromUri(string accountName, string fileName, Uri sourceUri);
    }
}