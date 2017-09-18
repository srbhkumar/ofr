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
    public static class EncryptionService
    {
        static string Key { get; set; }

        static EncryptionService()
        {
            Key = WebConfigurationManager.AppSettings["EncryptionKey"];
        }

        //Rewrite with actual encryption method
        public static  string Encrypt(string cleanString)
        {
            return System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(cleanString));
        }

        public static string Decrypt(string encryptedString)
        {
            return System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(encryptedString));
        }
    }
}