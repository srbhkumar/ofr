function SetCaseStatus(caseId, newStatus, username)
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
            if (newStatus == "Flagged")
            {
				doc.RecordAudit[doc.RecordAudit.length] = {"User" : username, "Time": time,  "Changes" :[{"Field": "Flagged", "Old": doc.Flagged, "New": true}]};
                doc.Flagged = true;
            }
            else if (newStatus == "Unflagged")
            {
				doc.RecordAudit[doc.RecordAudit.length] = {"User" : username, "Time": time,  "Changes" :[{"Field": "Flagged", "Old": doc.Flagged, "New": false}]};
                doc.Flagged = false;
            }
            else
            {
				doc.RecordAudit[doc.RecordAudit.length] = {"User" : username, "Time": time,  "Changes" :[{"Field": "Status", "Old": doc.Status, "New": newStatus}]};
                doc.Status = newStatus;
            }

            __.replaceDocument(doc._self, doc, (err, rep) =>
                {
                    if (err) throw err;
                });
        });
}