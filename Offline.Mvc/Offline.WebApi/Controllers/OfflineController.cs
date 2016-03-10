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
        [HttpGet]
        [Route("menu")]
        public IHttpActionResult GetMenuItems()
        {
            try
            {

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
    }
}
