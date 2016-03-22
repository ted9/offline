using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Offline.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace Offline.Core
{
    public class Utility
    {
        public static T lightClone<T, T2>(T2 originalObject, T targetObject)
        {
            PropertyInfo[] properties = originalObject.GetType().GetProperties();
            Type targetT = targetObject.GetType();
            foreach (var p in properties)
            {
                PropertyInfo targetP = targetT.GetProperty(p.Name);
                if (targetP != null)
                {
                    targetP.SetValue(targetObject, p.GetValue(originalObject));
                }
            }
            return targetObject;
        }

        public static T XmlToObject<T>(string xml)
        {
            var serializer = new XmlSerializer(typeof(T));
            if (string.IsNullOrEmpty(xml)) return default(T);
            using (TextReader reader = new StringReader(xml))
            {
                T result = (T)serializer.Deserialize(reader);
                return result;
            }
        }

        public static string ObjectToXml<T>(T obj)
        {
            var serializer = new XmlSerializer(typeof(T));
            var stringWriter = new StringWriter();
            var xWriterSettings = new XmlWriterSettings();
            xWriterSettings.OmitXmlDeclaration = true;
            using (var writer = XmlWriter.Create(stringWriter, xWriterSettings))
            {
                XmlSerializerNamespaces ns = new XmlSerializerNamespaces();
                ns.Add("", "");
                serializer.Serialize(writer, obj, ns);
                return stringWriter.ToString();
            }
        }

        public static T JsonToObject<T>(string jsonString)
        {
            return (T)JsonConvert.DeserializeObject(jsonString,
               new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
             );

        }

        
        public static string ObjectToJson<T>(T obj)
        {
            string json = JsonConvert.SerializeObject(
                obj,
                Newtonsoft.Json.Formatting.Indented,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
              );
            return json;
        }

        public static List<ParameterObj> CreateResponseResults(List<Parameter> returnParams)
        {
            var results = new List<ParameterObj>();
            foreach (var param in returnParams)
            {
                if (param.Type.ToLower() == "dataset")
                {
                    DataSet ds = param.Value as DataSet ;
                    results.AddRange(DataSetToResponseResult(ds));
                }
                else
                {
                    results.Add(new ParameterObj()
                    {
                        Name = param.Name,
                        Type = param.Type, 
                        Value = param.Value
                    });
                }
            }
            return results;
        }

        private static List<ParameterObj> DataSetToResponseResult(DataSet ds)
        {
            var results = new List<ParameterObj>();
            if (ds == null || ds.Tables.Count == 0) return null;
            var parentTables = new List<string>();
            var childTables = new List<string>();
            foreach (DataTable dt in ds.Tables)
            {
                parentTables.Add(dt.TableName);
            }
            foreach (DataRelation rel in ds.Relations)
            {
                if (parentTables.Contains(rel.ChildTable.TableName))
                {
                    parentTables.Remove(rel.ChildTable.TableName);
                }
              
            }
            var sb = new StringBuilder();
            foreach (string tableName in parentTables)
            {
                var Json = DataTableToJson(ds.Tables[tableName], 1, 10000);
                results.Add(new ParameterObj()
                {
                    Name = tableName,
                    Type = "datatable",
                    Value = Json
                });

            }
            return results;
        }

        private static List<Dictionary<string, object>> DataRowsToList(DataRow[] dataRows)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row;
            for (var i = 0; i < dataRows.Length; i++)
            {
                var dr = dataRows[i];
                row = new Dictionary<string, object>();
                foreach (DataColumn col in dr.Table.Columns)
                {
                    row.Add(col.ColumnName.Replace(" ", "").Replace(".", "_"), dr[col]);
                }
                rows.Add(row);
            }
            return rows;
            
        }
        public static TableValue DataTableToJson(DataTable dt, int pageIndex, int pageSize)
        {
            // pageIndex starts at 1

            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row;

            for (var i = (pageIndex - 1) * pageSize; i < dt.Rows.Count && i < pageIndex * pageSize; i++)
            {
                var dr = dt.Rows[i];
                row = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    //var colValue = dr[col].ToString();
                    //if (colValue.Split('<').Length > 4 && colValue.Split('>').Length == colValue.Split('<').Length)
                    //{

                    //}
                    //else
                    row.Add(col.ColumnName.Replace(" ", "").Replace(".", "_"), dr[col]);
                }
                
                foreach (DataRelation rel in dt.DataSet.Relations)
                {
                    var childRows = dr.GetChildRows(rel);
                    if (childRows.Length > 0)
                    {

                        row.Add(rel.RelationName, DataRowsToList(childRows));
                    }
                }
                rows.Add(row);
            }
            // var json =  ObjectToJson(rows);

            var v = new TableValue()
            {
                RowCount = dt.Rows.Count,
                PageIndex = pageIndex,
                PageSize = pageSize,
                Data = rows
            };
            return v;
            // var result = string.Format("{\"rowCount\":{0}, \"pageIndex\": {1}, \"pageSize\": {2}, \"data\": {3}", dt.Rows.Count, pageIndex , pageSize, json );
            //var result = ObjectToJson(v);
            //return result;

            #region old code
            //string colString = "\"{0}\":\"{1}\",";
            ////string rowString = "{{0}},";
            //StringBuilder sb = new StringBuilder();
            //foreach (DataRow row in dt.Rows)
            //{
            //    StringBuilder sc = new StringBuilder();
            //    foreach (DataColumn col in dt.Columns)
            //    {

            //        if (row[col] is System.DBNull)
            //        {
            //            sc.Append(string.Format(colString, col.ColumnName, "null"));
            //        }
            //        else
            //        {
            //            if (col.DataType.ToString() == "System.DateTime")
            //            {
            //                sc.Append(string.Format(colString, col.ColumnName,
            //                                            ((DateTime)row[col]).ToString("yyyy-MM-dd HH:mm:ss")));
            //            }
            //            else if (col.DataType.ToString() == "System.String")
            //            {
            //                sc.Append(string.Format(colString, col.ColumnName,
            //                                            string.Format("\"{0}\"", row[col])));
            //            }
            //            else
            //            {
            //                sc.Append(string.Format(colString, col.ColumnName, row[col]));
            //            }
            //        }

            //    }
            //    sc.Remove(sc.Length - 1, 1);
            //    sb.Append("{");
            //    sb.Append(sc.ToString());
            //    sb.Append("},");
            //}
            //if (sb.Length > 0) sb.Remove(sb.Length - 1, 1);
            //return sb.ToString();
            #endregion

        }
    }

    public class TableValue
    {
        public int RowCount { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public List<Dictionary<string, object>> Data { get; set; }
    }
}
