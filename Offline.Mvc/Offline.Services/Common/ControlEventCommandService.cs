using Offline.Core;
using Offline.Model;
using Offline.Service.DataService;
using Offline.Service.Interface.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Service.Common
{
    public class ControlEventCommandService : IControlEventCommandService
    {
        public List<ParameterObj> ExecuteEvent(ControlEvent controlEvent)
        {
            var results = DbService.Instance.RunStoredProcedure(controlEvent.FunctionName, controlEvent.RunParams);           
            return Utility.CreateResponseResults(results);
        }
    }
}
