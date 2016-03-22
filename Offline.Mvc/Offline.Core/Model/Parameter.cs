using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Xml.Serialization;

namespace Offline.Model
{

    public class Parameter 
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Direction { get; set; }
        [XmlIgnore]
        [ScriptIgnore]
        //[JsonIgnore]
        public object Value { get; set; }
        public string Source { get; set; }
        public string Val { get; set; }
        public string SourceId { get; set; }
    }

    public class ParameterObj
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public object Value { get; set; }
    }
}
