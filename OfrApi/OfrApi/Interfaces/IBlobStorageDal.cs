using System;
using System.IO;

namespace OfrApi.Interfaces
{
    public interface IBlobStorageDal
    {
        string UploadFromUri(string fileName, Uri sourceUri);
        string DownloadBlob(string fileName);
        void MoveFileToPoison(string filename);
        void MoveFileToProcessed(string filename);
        string UploadFromText(string fileName, string source);
    }
}