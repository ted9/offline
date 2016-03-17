using Autofac;
using Autofac.Integration.WebApi;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;

namespace Offline.WebApi
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
           
            var config = new HttpConfiguration();
            var builder = new ContainerBuilder();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly()).InstancePerRequest();
           
            var container = builder.Build();
            var dependencyResolver = new AutofacWebApiDependencyResolver(container);
            config.DependencyResolver = dependencyResolver;

            app.UseAutofacMiddleware(container);
            app.UseAutofacWebApi(config);

            WebApiConfig.Register(config);
            app.UseWebApi(config);
        }
    }
}