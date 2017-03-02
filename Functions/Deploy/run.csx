using System.Net;
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    System.Environment.CurrentDirectory = @"D:\Home\OFR";
    // seems to be some delay maybe? xcopy didn't pick up git changes right away.
    System.Diagnostics.Process.Start("cmd.exe", @"/C git pull && sleep 5 && xcopy /Y /S /D Functions ..\site\wwwroot\");

    // response
    return req.CreateResponse(HttpStatusCode.OK, new { Result = "Success" });
}