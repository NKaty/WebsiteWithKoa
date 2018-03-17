const morgan = require('koa-morgan');
const { stream } = require('../libs/winston')(module);

if (process.env.NODE_ENV === 'dev') {
  exports.init = app => app.use(morgan('dev'));
} else {
  exports.init = app => app.use(morgan('combined', { stream: stream }));
}
