using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Offline.Infrastructure.Logging
{
    public interface ILogger
    {
        void LogMessage(string msg);
        void LogException(Exception exception);
        void Log(Type typeThatIsLogging, LoggingLevel level, string format, object[] objectToLog);
    }
}
