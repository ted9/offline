using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Model
{
    public class ControlInfo 
    {
        [ReadOnly(true)]
        public int ControlId { get; set; }
        [Browsable(false)]
        public int ParentId { get; set; }
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string UniqueKey { get; set; }
        public string ControlName { get; set; }
        public string Caption { get; set; }
        public string ControlType { get; set; }
        public string Html { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public string Properties { get; set; }
        public string DataType { get; set; }
        public string FieldName { get; set; }
        public string ControlSource { get; set; }
        public string FormatString { get; set; }
        public string DefaultValue { get; set; }
        public string ValidationRule { get; set; }
        //private ValidationRule _validationRule;
        //public ValidationRule Validation
        //{
        //    get
        //    {
        //        if (_validationRule == null)
        //        {
        //            _validationRule = Utility.XmlToObject<ValidationRule>(ValidationRule);
        //        }
        //        return _validationRule;
        //    }
        //}
        public bool NewLine { get; set; }
        public int? Width { get; set; }
        public int? LabelWidth { get; set; }
        public int? Height { get; set; }
        public double DisplayOrder { get; set; }
        public bool IsVisible { get; set; }
        public bool IsCreated { get; set; }
        
        private List<ControlEvent> _Events = new List<ControlEvent>();
        public List<ControlEvent> Events
        {
            get { return _Events; }
            set { _Events = value; }
        }
    }
}
