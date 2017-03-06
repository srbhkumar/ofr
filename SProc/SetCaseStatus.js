function SetCaseStatus(caseId, newStatus)
{
    __.chain()
        .filter(d => d.id == caseId)
        .value((err, docs) =>
        {
            if (err) throw err;
            var doc = docs[0];
            doc.UpdatedOn = new Date();
            
            if (newStatus == "Flagged")
            {
                doc.Flagged = true;
            }
            else if (newStatus == "Unflagged")
            {
                doc.Flagged = false;
            }
            else
            {
                doc.Status = newStatus;
            }

            __.replaceDocument(doc._self, doc, (err, rep) =>
                {
                    if (err) throw err;
                });
        });
}