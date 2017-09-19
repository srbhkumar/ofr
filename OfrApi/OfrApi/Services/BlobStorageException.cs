using System;

namespace OfrApi.Services
{
    public class BlobStorageException : Exception
    {
        public BlobStorageException(string message)
            : base(message)
        {
        }
    }
}