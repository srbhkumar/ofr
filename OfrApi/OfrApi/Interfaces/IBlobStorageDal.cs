using System;
using System.IO;

namespace OfrApi.Interfaces
{
    public interface IBlobStorageDal
    {
        bool UploadFromStream(string fileName, Stream sourceStream);
        bool UploadFromText(string fileName, string source);
        void UploadFromUri(string fileName, Uri sourceUri);
        object DownloadBlob(string fileName);
    }
}