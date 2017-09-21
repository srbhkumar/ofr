using System;
using System.IO;

namespace OfrApi.Interfaces
{
    public interface IBlobStorageDal
    {
        bool UploadFromStream(string fileName, Stream sourceStream);
        bool UploadFromText(string fileName, string source);
        string UploadFromUri(string fileName, Uri sourceUri);
        string DownloadBlob(string fileName);
        void MoveFileToPoison(string filename);
        void MoveFileToProcessed(string filename);
    }
}