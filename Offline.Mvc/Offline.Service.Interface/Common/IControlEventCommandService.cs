using Offline.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Service.Interface.Common
{
    public interface IControlEventCommandService
    {
        List<Parameter> ExecuteEvent(ControlEvent controlEvent);
    }
}
