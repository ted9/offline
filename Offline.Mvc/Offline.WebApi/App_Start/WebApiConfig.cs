using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Offline.WebApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config) {
            config.MapHttpAttributeRoutes();
          
            config.Routes.MapHttpRoute(name: "offlineweb", 
                routeTemplate: "{controller}", 
                defaults: new { controller = "Offline" });

      
        }
    }
}