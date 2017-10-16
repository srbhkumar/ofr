using OfrApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OfrApi.Services
{
    public static class HeaderMap
    {
        public static Case MapToCase(List<string> header, List<string> fields)
        {
            var caseId = header.IndexOf("CASENUM");
            var jurisdiction = header.IndexOf("INCIDENT_COUNTY");
            var residence = header.IndexOf("RES_COUNTY");
            var dod = header.IndexOf("DATE_OF_DEATH");
            var dob = header.IndexOf("DATE_OF_BIRTH");
            var mod = header.IndexOf("MANNER");
            var race = header.IndexOf("RACE_ETHNICITY");
            var cod = header.IndexOf("CODICD");
            var aad = header.IndexOf("AGE");
            var yod = header.IndexOf("YEAR_OF_DEATH");
            var gender = header.IndexOf("GENDER");

            //Creates a list of all drugs with a value of 1
            //Based on the assumption that acetaminophen and 
            //zolpidem will always be the first and last drugs
            var firstDrug = header.IndexOf("ACETAMINOPHEN");
            var lastDrug = header.IndexOf("ZOLPIDEM");
            var drugSparse = fields.Skip(firstDrug)
                                .Take(lastDrug - firstDrug).ToArray();
            var drugName = header.Skip(firstDrug)
                                .Take(lastDrug - firstDrug).ToArray();

            var drugsInSystem = drugSparse.Zip(drugName, (a, b) => Tuple.Create(a, b)).ToList();
            drugsInSystem.RemoveAll(d => d.Item1 == "0");

            Case newCase = new Case();
            newCase.id = Guid.NewGuid().ToString();
            newCase.OCME = fields[caseId];
            newCase.Jurisdiction = fields[jurisdiction];

            Dictionary<string, string> pairs = new Dictionary<string, string>();
            pairs.Add("CountyofDeath", fields[jurisdiction]);
            pairs.Add("CauseofDeath", fields[cod]);
            pairs.Add("ResidentJurisdiction", fields[residence]);
            pairs.Add("MannerofDeath", fields[mod]);
            pairs.Add("AgeatDeath", fields[aad]);
            pairs.Add("Race", fields[race]);
            pairs.Add("YearofDeath", fields[yod]);
            pairs.Add("Sex", fields[gender]);
            //change format of Date of Death and Date of Birth
            pairs.Add("DateofDeath", DateTime.Parse(fields[dod]).ToString("yyyy-MM-dd"));
            pairs.Add("DateofBirth", DateTime.Parse(fields[dob]).ToString("yyyy-MM-dd"));
            newCase.Data = pairs;

            newCase.DrugsInSystem = new List<string>(drugsInSystem.Select(d => d.Item2));

            //Joins all OCME fields to their header as a dictionary
            newCase.OCMEData = header.Zip(fields, (k, v) => new { k, v })
                                    .ToDictionary(x => x.k, x => x.v);
            
            return newCase;
        }
    }
}