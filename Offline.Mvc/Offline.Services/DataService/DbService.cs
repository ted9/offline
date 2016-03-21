using Offline.Core;
using Offline.Model;
using Offline.Service.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Service.DataService
{
    
    public class DbService
    {
        private string _connectionString = "";
        protected string ConnectionString
        {
            get { return _connectionString; }
            set { _connectionString = value; }
        }

        private bool _enableCaching = true;
        protected bool EnableCaching
        {
            get { return _enableCaching; }
            set { _enableCaching = value; }
        }

        private int _cacheDuration = 0;
        protected int CacheDuration
        {
            get { return _cacheDuration; }
            set { _cacheDuration = value; }
        }


        static private DbService _instance = null;
        /// <summary>
        /// Returns an instance of the provider type specified in the config file
        /// </summary>
        static public DbService Instance
        {
            get
            {
                if (_instance == null)
                    _instance = new DbService();
                return _instance;
            }
        }

        public DbService()
        {
            this.ConnectionString = ConfigurationSetting.GetConnectionString();
        }

        public SqlConnection GetConnection()
        {
            return new SqlConnection(ConnectionString);
        }
        public int ExecuteNonQuery(string sql)
        {
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    return cmd.ExecuteNonQuery();
                }
            }
        }

        public SqlDataReader ExecuteReader(string sql)
        {
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    return cmd.ExecuteReader();
                }
            }
        }

        public object ExecuteScalar(string sql)
        {
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    object obj = cmd.ExecuteScalar();
                    cmd.Prepare();
                    return obj != null ? obj.ToString() : string.Empty;
                }
            }
        }

        public T ExecuteStoredProcedure<T>(string spName, SqlParameter[] parameter) where T : new()
        {
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(spName, conn);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                if (parameter != null && parameter.Length > 0)
                    cmd.Parameters.AddRange(parameter);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    T t = new T();
                    PopulateObject<T>(reader, t);
                    return t;
                }
                return default(T);
            }
        }

        public List<T> ExecuteStoredProcedureList<T>(string spName, SqlParameter[] parameter) where T : new()
        {
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(spName, conn);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                if (parameter != null && parameter.Length > 0)
                    cmd.Parameters.AddRange(parameter);
                SqlDataReader reader = cmd.ExecuteReader();
                List<T> list = new List<T>();
                while (reader.Read())
                {
                    T t = new T();
                    PopulateObject<T>(reader, t);
                    list.Add(t);
                }
                return list;
            }
        }


        private void PopulateObject<T>(SqlDataReader reader, T t)
        {
            var properties = t.GetType().GetProperties();
            var fieldNames = Enumerable.Range(0, reader.FieldCount).Select(i => reader.GetName(i).ToLower()).ToArray();
            foreach (var p in properties)
            {
                if (fieldNames.Contains(p.Name.ToLower()))
                {
                    p.SetValue(t, reader[p.Name] is System.DBNull ? null : reader[p.Name]);
                }
                else
                {
                    //TW: Write Warnning Message:
                }
            }
        }

        public List<T> ConvertToObject<T>(DataRow[] rows) where T : new()
        {
            if (rows == null || rows.Length == 0) return null;
            var t = new T();
            var properties = t.GetType().GetProperties();
            var list = new List<T>();
            var table = rows[0].Table;
            foreach (DataRow row in rows)
            {
                t = new T();
                foreach (var p in properties)
                {
                    if (table.Columns.Contains(p.Name))
                    {
                        p.SetValue(t, row[p.Name] is System.DBNull ? null : row[p.Name]);
                    }
                    else
                    {
                        //TW: Write Warnning Message:
                    }
                }
                list.Add(t);
            }
            return list;
        }
        public List<T> ConvertToObject<T>(DataTable table) where T : new()
        {
            var t = new T();
            var properties = t.GetType().GetProperties();
            var list = new List<T>();
            foreach (DataRow row in table.Rows)
            {
                t = new T();
                foreach (var p in properties)
                {
                    if (table.Columns.Contains(p.Name))
                    {
                        p.SetValue(t, row[p.Name] is System.DBNull ? null : row[p.Name]);
                    }
                    else
                    {
                        //TW: Write Warnning Message:
                    }
                }
                list.Add(t);
            }
            return list;
        }

        public List<Parameter> RunStoredProcedure(string spName, List<Parameter> inputs)
        {
            using (var conn = DbService.Instance.GetConnection())
            {
                SqlCommand cmd = new SqlCommand(spName, conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                if (inputs != null && inputs.Count == 1 && inputs[0].Value is DataTable)
                {
                    var dt = inputs[0].Value as DataTable;
                    if (dt.Columns.Count == 0 || dt.Rows.Count == 0) return inputs;

                    SqlCommandBuilder.DeriveParameters(cmd);
                    foreach (SqlParameter sqlParam in cmd.Parameters)
                    {
                        if (dt.Columns.Contains(sqlParam.ParameterName.Substring(1)))
                        {
                            sqlParam.SourceColumn = sqlParam.ParameterName.Substring(1);
                        }
                    }
                    var da = new SqlDataAdapter();

                    da.InsertCommand = cmd;
                    da.UpdateCommand = cmd;
                    da.Update(dt);
                    return inputs;
                }
              
                if (inputs != null)
                {
                    SqlCommandBuilder.DeriveParameters(cmd);
                    foreach (SqlParameter sqlParam in cmd.Parameters)
                    {
                        var p = inputs.Where(x => x.Name.ToLower() == sqlParam.ParameterName.Substring(1).ToLower()).FirstOrDefault();
                        if (p != null)
                        {
                            if (p.Value == null)
                            {
                                sqlParam.Value = DBNull.Value;
                            }
                            else
                            {
                                if (sqlParam.DbType == DbType.Boolean)
                                {
                                    sqlParam.Value = (p.Value.ToString() == "1" || p.Value.ToString().ToLower() == "true");
                                }
                                else
                                {
                                    sqlParam.Value = p.Value;
                                }
                            }
                        }
                    }
                }
                
                SqlDataAdapter da2 = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                da2.Fill(ds);

                var paramList = new List<Parameter>();
                if (ds.Tables.Count > 0)
                    paramList.Add(new Parameter() { Name = ds.DataSetName, Value = ds, Type = "DataSet", Direction = "Output" });

                foreach (SqlParameter sqlParam in cmd.Parameters)
                {
                    if (sqlParam.Direction == ParameterDirection.InputOutput || sqlParam.Direction == ParameterDirection.ReturnValue)
                    {
                        paramList.Add(new Parameter()
                        {
                            Name = sqlParam.ParameterName.Substring(1),
                            Value = sqlParam.Value,
                            Type = sqlParam.DbType.ToString(),
                            Direction = "Output"
                        });
                    }
                }

               
                RenameOutputs(paramList, inputs);
                RelationShipOutputs(paramList, inputs);
                return paramList;
            }
        }
        /// <summary>
        /// <Parameter>
        /// <type>Rename</type>
        /// <Val>Table=Table1;Table2=Table3;Table.[Column]=Table2.[Column2];Table.{1}=Table2.ColumnId</Val>
        /// </Parameter>
        /// </summary>
        /// <param name="ds"></param>
        /// <param name="inputs"></param>
        private void RenameOutputs(List<Parameter> outputs, List<Parameter> inputs)
        {
            if (outputs.Count == 0) return;
            if (inputs == null) return;
            var i = inputs.FindIndex(x => x.Name.ToLower() == "(rename)");
            if (i == -1) return;
            var changeNames = new List<KeyValuePair<string, string>>();

            var renameStr = inputs[i].Value.ToString();
            List<NameMapping> renames = Utility.XmlToObject<List<NameMapping>>(renameStr);
            var pds = outputs.Where(x => x.Type == "DataSet").FirstOrDefault();
            DataSet ds = null;
            if (pds != null) ds = pds.Value as DataSet;

            foreach (var nm in renames)
            {

                var oldName = nm.OldName;
                var newName = nm.NewName;

                if (oldName.IndexOf('.') > 0)
                {
                    var tableName = oldName.Split('.')[0];
                    var colName = oldName.Split('.')[1];

                    var c = changeNames.FindIndex(x => x.Key == tableName);
                    if (c != -1)
                        tableName = changeNames[c].Value;
                    var tableItem = ds.Tables[tableName]; // outputs.Where(x => x.Name.ToLower() == tableName.ToLower()).FirstOrDefault();

                    if (tableItem != null)
                    {
                        var dt = tableItem; //.Value as DataTable;
                        if (colName.StartsWith("{") && colName.EndsWith("}"))
                        {
                            colName = colName.Replace("{", "").Replace("}", "");
                            i = int.Parse(colName);
                            if (i < dt.Columns.Count)
                            {
                                dt.Columns[i].ColumnName = newName;
                            }
                        }
                        else
                        {
                            colName = colName.Replace("[", "").Replace("]", "");
                            if (dt.Columns.Contains(colName))
                            {
                                dt.Columns[colName].ColumnName = newName;
                            }
                        }
                        if (dt.Columns.Contains(colName))
                            dt.Columns[colName].ColumnName = newName;
                    }

                }
                else
                {
                    // outputs.Where(x => x.Name.ToLower() == oldName.ToLower()).FirstOrDefault();
                    if (ds != null && ds.Tables[oldName] != null)
                    {
                        var tableItem = ds.Tables[oldName];
                        tableItem.TableName = newName;
                        changeNames.Add(new KeyValuePair<string, string>(oldName, newName));
                    }
                    else
                    {
                        var item = outputs.Where(x => x.Name.ToLower() == oldName.ToLower()).FirstOrDefault();
                        if (item != null) item.Name = newName;
                    }
                    //    tableItem.TableName = newName;
                }
            }
            

        }

        private void RelationShipOutputs(List<Parameter> outputs, List<Parameter> inputs)
        {
            if (outputs.Count == 0) return;
            if (inputs == null) return;
            var i = inputs.FindIndex(x => x.Name.ToLower() == "(relation)");
            if (i == -1) return;
           
            var relationStr = inputs[i].Value.ToString();
            List<RelMapping> relNames = Utility.XmlToObject<List<RelMapping>>(relationStr);
            var pds = outputs.Where(x => x.Type == "DataSet").FirstOrDefault();
            DataSet ds = null;
            if (pds != null) ds = pds.Value as DataSet;

            foreach (var rm in relNames)
            {
                var parentName = rm.Parent;
                var childName = rm.Child;

                var parentNames = parentName.Split(',');
                var childNames = childName.Split(',');
                if (parentNames.Length != childNames.Length)
                {
                    //log something
                    continue;
                }
                DataColumn[] parentColumns = new DataColumn[parentNames.Length];
                DataColumn[] childColumns = new DataColumn[childNames.Length];

                for (i = 0; i < parentNames.Length; i++)
                {
                    if (parentNames[i].IndexOf('.') > 0 && childNames[i].IndexOf('.') > 0)
                    {
                        var parentTable = parentNames[i].Split('.')[0];
                        var parentColumn = parentNames[i].Split('.')[1];
                        var childTable = childNames[i].Split('.')[0];
                        var childColumn = childNames[i].Split('.')[1];

                        parentColumns[i] = ds.Tables[parentTable].Columns[parentColumn];
                        childColumns[i] = ds.Tables[childTable].Columns[childColumn];
                    }
                }
                ds.Relations.Add(new DataRelation(rm.Name, parentColumns, childColumns));
            }
        }
    }

}
