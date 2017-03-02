function PingCase(caseId, username)
{
    __.chain()
        .filter(d => d.id == caseId)
        .value((err, docs) =>
        {
            if (err) throw err;
            if (docs.length == 0) throw "No such case";
            var doc = docs[0];
            
            if (!doc.PingData)
            {
                doc.PingData = {};
            }

            doc.PingData[username] = new Date();
            
            __.replaceDocument(doc._self, doc, (err, rep) =>
                {
                    if (err) throw err;
                    getContext().getResponse().setBody(doc.PingData);
                });
        });
}