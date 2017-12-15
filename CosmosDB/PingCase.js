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
            else
            {
                /* auto prune */
                var pruneThreshold = new Date(new Date() - 3 * 60 * 1000);

                for(var user in doc.PingData)
                {
                    if (Date.parse(doc.PingData[user]) < pruneThreshold)
                    {
                        delete doc.PingData[user];
                    }
                }
            }
            
            doc.PingData[username] = new Date();
            
            __.replaceDocument(doc._self, doc, (err, rep) =>
                {
                    if (err) throw err;
                    getContext().getResponse().setBody(doc.PingData);
                });
        });
}