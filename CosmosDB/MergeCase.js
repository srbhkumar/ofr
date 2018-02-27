function MergeCase(caseId, newData, username)
{
    __.chain()
        .filter(d => d.id == caseId)
        .value((err, docs) =>
        {
            if (err) throw err;
            var doc = docs[0];
            var time = new Date();
            doc.UpdatedOn = time;

            var changes = [];
            for(var f in newData)
            {
                if(doc.Data[f] != newData[f])
                    changes.push({"Field" : f, "Old" : doc.Data[f], "New" : newData[f] });
                doc.Data[f] = newData[f];
            }
            if(!doc.RecordAudit)
                doc.RecordAudit = [];
            doc.RecordAudit[doc.RecordAudit.length] = {"User" : username, "Time": time,  "Changes" :changes};
            __.replaceDocument(doc._self, doc, (err, rep) =>
                {
                    if (err) throw err;
                });
        });
}