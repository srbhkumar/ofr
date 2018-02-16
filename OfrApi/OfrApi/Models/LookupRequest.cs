using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OfrApi.Models
{
    public class LookupRequest
    {
        [JsonProperty(PropertyName = "dateofBirth")]
        public List<DOB> DateOfBirth { get; set; }

        [JsonProperty(PropertyName = "homeAddress")]
        public List<Address> Address { get; set; }

        [JsonProperty(PropertyName = "gender")]
        public List<Gender> Gender { get; set; }

        [JsonProperty(PropertyName = "patientName")]
        public List<Name> Name { get; set; }
    }

    public class Address
    {
        [JsonProperty(PropertyName = "street")]
        public string Street { get; set; }

        [JsonProperty(PropertyName = "state")]
        public string State { get; set; }

        [JsonProperty(PropertyName = "zipCode")]
        public string ZipCode { get; set; }

        [JsonProperty(PropertyName = "city")]
        public string City { get; set; }
    }

    public class Name
    {
        [JsonProperty(PropertyName = "onmFirst")]
        public string First { get; set; }

        [JsonProperty(PropertyName = "onmLast")]
        public string Last { get; set; }

        [JsonProperty(PropertyName = "onmMiddle")]
        public string Middle { get; set; }

    }

    public class Gender
    {
        [JsonProperty(PropertyName = "attrValue")]
        public char GenderValue { get; set; }
    }

    public class DOB
    {
        [JsonProperty(PropertyName = "dateVal")]
        public string DateVal { get; set; }
    }
}