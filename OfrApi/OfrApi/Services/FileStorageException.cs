using System;

namespace OfrApi.Services
{
    public class FileStorageException : Exception
    {
        public FileStorageException(string message)
            : base(message)
        {
        }
    }
}