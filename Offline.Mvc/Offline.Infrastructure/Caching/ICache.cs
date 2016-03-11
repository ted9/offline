using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Infrastructure.Caching
{
    public interface ICache
    {
        object GetObject(string key);
        object AddObject(string key, DateTime expireDate, object item);
    }
}
