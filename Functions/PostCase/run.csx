#load "../Case.csx"

using System.Net;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string caseId, TraceWriter log)
{
    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    // pull up relevant case

    // transfer allowed fields
    // todo: validate against case template

    // save results

    // response
    return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
}