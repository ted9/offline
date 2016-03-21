using Offline.Model;
using Offline.Service.Interface.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
                controlEvent.FunctionName = "MENU_GET_P";
                var results = eventService.ExecuteEvent(controlEvent);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
    }
}
