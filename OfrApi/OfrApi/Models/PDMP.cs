using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OfrApi.Models
{
    public class PDMPData
    {
        public string Notice { get; set; }
        public bool IsRegistered { get; set; }
        public IList<PDMP> Results { get; set; } = new List<PDMP>();
    }
    public class PDMP
    {
        public string Label { get; set; }
        public DateTime DateWritten { get; set; }
        public DateTime DateFilled { get; set; }
        public string DaysSupply { get; set; }
        public PDMPPrescriber PrescribingProvider { get; set; }
        public string QuantityDispensed { get; set; }
        public string PharmacyName { get; set; }
        public string PaymentMethod { get; set; }
        public PDMPAddress PharmacyAddress { get; set; }
    }

    public class PDMPAddress
    {
        public string Street1 { get; set; }
        public string Street2 { get; set; }
        public string Locality { get; set; }
        public string Region { get; set; }
        public string Postal { get; set; }
    }

    

    public class PDMPPrescriber
    {
        public PrescriberName Name { get; set; }
        public PDMPAddress Address { get; set; }
    }

    public class PrescriberName
    {
        public string First { get; set; }
        public string Last { get; set; }
    }
        
}