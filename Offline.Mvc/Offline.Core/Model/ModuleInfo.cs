using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Model
{
    public class ModuleInfo 
    {
        [Browsable(false)]
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string ModuleType { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public string TypeName { get; set; }

        public string Host { get; set; }

        public string Properties { get; set; }

        public string InitParams { get; set; }

        public int? Width { get; set; }
        public int? Height { get; set; }

        private List<ControlInfo> _ControlList = new List<ControlInfo>();
        [Browsable(false)]
        public List<ControlInfo> ControlList
        {
            get { return _ControlList; }
            set { _ControlList = value; }
        }
    }
}
