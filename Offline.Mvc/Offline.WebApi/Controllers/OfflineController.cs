using Offline.Model;
using Offline.Service.Interface.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace Offline.WebApi.Controllers
{
    [RoutePrefix("api/offline")]
    public class OfflineController : BaseController
    {
        private readonly IControlEventCommandService eventService;
        public OfflineController(IControlEventCommandService eventService)
        {
            Console.WriteLine("");
            this.eventService = eventService;
        }
        [HttpPost]
        [Route("menu")]
        public IHttpActionResult GetMenuItems([FromBody]ControlEvent controlEvent)
        {
            try
            {
               // controlEvent.FunctionName = "MENU_GET_P";
                var results = eventService.ExecuteEvent(controlEvent);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpGet]
        [Route("download")]
        public HttpResponseMessage DownloadLibraryDocumentation([FromUri] string documentName)
        {

            byte[] data;
            Stream docStream = null;
            MemoryStream ms = new MemoryStream();
            docStream.CopyTo(ms);
            data = ms.ToArray();
            var responseMessage = Request.CreateResponse();
            responseMessage.Content = new ByteArrayContent(data);
            responseMessage.Content.Headers.Add("content-disposition", String.Format("attachment; filename={0}", Uri.EscapeDataString(documentName)));
            responseMessage.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-force-download");
            return responseMessage;
        }

    }
}
