function SubmitCase(caseId, username)
{
    __.chain()
        .filter(d => d.id == caseId)
        .value((err, docs) =>
        {
            if (err) throw err;
            var doc = docs[0];
            var time = new Date();
            doc.UpdatedOn = time;
            if(!doc.RecordAudit)
                doc.RecordAudit = [];
            doc.RecordAudit[doc.RecordAudit.length] = {"User" : username, "Time": time,  "Changes" :[{"Field": "Status", "Old": doc.Status, "New": "Submitted"}]};
            doc.Status = "Submitted";
            __.replaceDocument(doc._self, doc, (err, rep) =>
                {
                    if (err) throw err;
                });
        });
}