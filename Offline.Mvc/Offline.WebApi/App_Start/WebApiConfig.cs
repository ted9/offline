using Newtonsoft.Json.Serialization;
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
            // Web API configuration and services
            var formatters = config.Formatters;
            var jsonFormatter = formatters.JsonFormatter;
            var settings = jsonFormatter.SerializerSettings;
            //settings.Formatting = Formatting.Indented;
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            //config.ParameterBindingRules.Add(p =>
            //{
            //    if (p.ParameterType == typeof(int[]))
            //    {
            //        return new CommaDelimitedParametersBinding(p);
            //    }
            //    if (p.ParameterType == typeof(string[]))
            //    {
            //        return new CommaDelimitedParametersBinding(p);
            //    }
            //    return null;
            //});

            config.MapHttpAttributeRoutes();
          
            config.Routes.MapHttpRoute(name: "offlineweb", 
                routeTemplate: "{controller}", 
                defaults: new { controller = "Offline" });

      
        }
    }
}