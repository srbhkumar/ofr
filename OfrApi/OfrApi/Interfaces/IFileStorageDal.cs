using System;

namespace OfrApi.Interfaces
{
    public interface IFileStorageDal
    {
        void DeleteFile(string directoryName, string fileName);
        Uri GetFileUri(string directoryName, string fileName);
    }
}