function MergeCase(caseId, newData)
{
    __.chain()
        .filter(d => d.id == caseId)
        .value((err, docs) =>
        {
            if (err) throw err;
            var doc = docs[0];
            doc.UpdatedOn = new Date();
            
            for(var f in newData)
            {
                doc.Data[f] = newData[f];
            }
            
            __.replaceDocument(doc._self, doc, (err, rep) =>
                {
                    if (err) throw err;
                });
        });
}