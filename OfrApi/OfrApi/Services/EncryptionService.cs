using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Configuration;

namespace OfrApi.Services
{
    //This class currently does no true encryption
    //just converts between plaintext and base64
    public class EncryptionService
    {
        string Key { get; set; }

        public EncryptionService()
        {
            Key = WebConfigurationManager.AppSettings["EncryptionKey"];
        }

        public EncryptionService(string key)
        {
            Key = key;
        }

        //Rewrite with actual encryption method
        public string Encrypt(string cleanString)
        {
            return System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(cleanString));
        }

        public string Decrypt(string encryptedString)
        {
            return System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(encryptedString));
        }
    }
}