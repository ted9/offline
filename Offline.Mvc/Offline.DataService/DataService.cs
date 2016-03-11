using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Data
{
    public class DataService
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


        static private DataService _instance = null;
        /// <summary>
        /// Returns an instance of the provider type specified in the config file
        /// </summary>
        static public DataService Instance
        {
            get
            {
                if (_instance == null)
                    _instance = new DataService();
                return _instance;
            }
        }

        public DataService()
        {
            //this.ConnectionString = Globals.Settings.SiteSettings.ConnectionString;
            //this.EnableCaching = Globals.Settings.SiteSettings.EnableCaching;
            //this.CacheDuration = Globals.Settings.SiteSettings.CacheDuration;
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

    }

}
