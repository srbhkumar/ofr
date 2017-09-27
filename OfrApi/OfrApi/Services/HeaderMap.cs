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
            var caseId = header.IndexOf("﻿CaseNum");
            var jurisdiction = header.IndexOf("Incident County");
            var residence = header.IndexOf("Res County");
            var dod = header.IndexOf("DATE_OF_DEATH");
            var dob = header.IndexOf("Date Of Birth");
            var mod = header.IndexOf("Manner");
            var race = header.IndexOf("Race/ethnicity");
            var cod = header.IndexOf("CODICD");
            var aad = header.IndexOf("Age");
            var yod = header.IndexOf("Year_Of_Death");
            var gender = header.IndexOf("Gender");

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