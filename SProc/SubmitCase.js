function SubmitCase(caseId)
{
    __.chain()
        .filter(d => d.id == caseId)
        .value((err, docs) =>
        {
            if (err) throw err;
            var doc = docs[0];
            doc.UpdatedOn = new Date();
            doc.Status = "Submitted";

            __.replaceDocument(doc._self, doc, (err, rep) =>
                {
                    if (err) throw err;
                });
        });
}