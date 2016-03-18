using Offline.Infrastructure.Caching;
using Offline.Infrastructure.Logging;
using Offline.Model;
using Offline.Service.Interface;
using Offline.Service.Interface.Root;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Service.Root
{
    public class NavigatorQueryService : INavigatorQueryService
    {
        private readonly ILogger logger;
        private readonly ICache caching;
        public NavigatorQueryService(ILogger logger, ICache caching)
        {
            this.logger = logger;
            this.caching = caching;         
        }

        public List<Parameter> GetMenuItems()
        {
            var list = new List<Parameter>();


            return list;

        }
    }

   
}
