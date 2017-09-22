using System;

namespace OfrApi.Interfaces
{
    public interface IFileStorageDal
    {
        void DeleteFile(string fileName);
        Uri GetFileUri(string fileName);
    }
}