using Offline.Model;
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
        public List<Parameter> ExecuteEvent(ControlEvent controlEvent)
        {
            return null;
        }

        //private List<Parameter> RunStoredProcedure(string spName, List<Parameter> inputs)
        //{
        //    using (var conn = DataService.Instance.GetConnection())
        //    {
        //        SqlCommand cmd = new SqlCommand(spName, conn);
        //        cmd.CommandType = CommandType.StoredProcedure;
        //        conn.Open();

        //        if (inputs != null && inputs.Count == 1 && inputs[0].Value is DataTable)
        //        {
        //            var dt = inputs[0].Value as DataTable;
        //            if (dt.Columns.Count == 0 || dt.Rows.Count == 0) return inputs;

        //            SqlCommandBuilder.DeriveParameters(cmd);
        //            foreach (SqlParameter sqlParam in cmd.Parameters)
        //            {
        //                if (dt.Columns.Contains(sqlParam.ParameterName.Substring(1)))
        //                {
        //                    sqlParam.SourceColumn = sqlParam.ParameterName.Substring(1);
        //                }
        //            }
        //            var da = new SqlDataAdapter();

        //            da.InsertCommand = cmd;
        //            da.UpdateCommand = cmd;
        //            da.Update(dt);
        //            return inputs;
        //        }
        //        else
        //        {
        //            if (inputs != null)
        //            {
        //                SqlCommandBuilder.DeriveParameters(cmd);
        //                foreach (SqlParameter sqlParam in cmd.Parameters)
        //                {
        //                    var p = inputs.Where(x => x.Name.ToLower() == sqlParam.ParameterName.Substring(1).ToLower()).FirstOrDefault();
        //                    if (p != null)
        //                    {
        //                        if (p.Value == null)
        //                        {
        //                            sqlParam.Value = DBNull.Value;
        //                        }
        //                        else
        //                        {
        //                            if (sqlParam.DbType == DbType.Boolean)
        //                            {
        //                                sqlParam.Value = (p.Value.ToString() == "1" || p.Value.ToString().ToLower() == "true");
        //                            }
        //                            else
        //                            {
        //                                sqlParam.Value = p.Value;
        //                            }
        //                        }
        //                    }
        //                }

        //            }
        //            SqlDataAdapter da = new SqlDataAdapter(cmd);
        //            DataSet ds = new DataSet();
        //            da.Fill(ds);

        //            var paramList = new List<Parameter>();

        //            foreach (SqlParameter sqlParam in cmd.Parameters)
        //            {
        //                if (sqlParam.Direction == ParameterDirection.InputOutput || sqlParam.Direction == ParameterDirection.ReturnValue)
        //                {
        //                    paramList.Add(new Parameter()
        //                    {
        //                        Name = sqlParam.ParameterName.Substring(1),
        //                        Value = sqlParam.Value,
        //                        Type = sqlParam.DbType.ToString(),
        //                        Direction = "Output"
        //                    });
        //                }
        //            }


        //            //foreach (DataTable dt in ds.Tables)
        //            //{
        //            if (ds.Tables.Count > 0)
        //                paramList.Add(new Parameter() { Name = ds.DataSetName, Value = ds, Type = "DataSet", Direction = "Output" });
        //            //}
        //            RenameOutputs(paramList, inputs);
        //            return paramList;

        //        }


        //    }
        //}
    }
}
