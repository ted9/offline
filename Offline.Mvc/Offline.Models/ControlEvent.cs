using Offline.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Model
{
  
    public class ControlEvent 
    {
        public int EventId
        {
            get;
            set;
        }

        public string EventName { get; set; }
        public int ControlId { get; set; }
        public string ControlName { get; set; }
        public string ControlType { get; set; }
        public string InputParams { get; set; }
        public string TargetControlId { get; set; }
        public string FunctionName { get; set; }
        public string EventDesc { get; set; }
        public string FollowEventId { get; set; }
        public string TimeStamp { get; set; }

        public bool IsPrevent { get; set; }

        public bool PropertyChanged { get; set; }


        private List<Parameter> _EventParams;
        public List<Parameter> EventParams
        {
            get
            {             
                if (_EventParams == null)
                {
                    if (InputParams != null)
                        _EventParams = Utility.XmlToObject<List<Parameter>>(InputParams);
                    else
                        _EventParams = new List<Parameter>();     
                }
                return _EventParams;
            }
            set
            {
                _EventParams = value;
            }
        }

        private List<Parameter> _RunParams = new List<Parameter>();
        public List<Parameter> RunParams
        {
            get { return _RunParams; }
            set { _RunParams = value; }
        }
    }
}
