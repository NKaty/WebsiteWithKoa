const winston = require('winston');
const path = require('path');
winston.emitErrs = true;

const getLogger = (module) => {
  const modulePath = module.filename.split('/').slice(-2).join('/');
  let info, error;
  if (process.env.NODE_ENV === 'dev') {
    info = new winston.Logger({
      level: 'info',
      transports: [
        new (winston.transports.Console)({
          json: false,
          label: modulePath
        })
      ]
    });

    error = new winston.Logger({
      level: 'error',
      transports: [
        new (winston.transports.Console)({
          json: false,
          label: modulePath
        })
      ]
    });
  } else {
    info = new winston.Logger({
      level: 'info',
      transports: [
        new (winston.transports.File)({
          filename: `${path.join(process.cwd(), 'logs', 'log-info.log')}`,
          label: modulePath
        })
      ]
    });

    error = new winston.Logger({
      level: 'error',
      transports: [
        new (winston.transports.File)({
          filename: `${path.join(process.cwd(), 'logs', 'log-error.log')}`,
          label: modulePath
        })
      ]
    });
  }

  const stream = {
    write: function (message, encoding) {
      info.info(message);
    }
  };

  return {
    logInfo: info,
    logError: error,
    stream: stream
  };
};

module.exports = getLogger;
