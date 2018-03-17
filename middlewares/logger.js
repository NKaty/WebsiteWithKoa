//const logger = require('koa-logger');
const morgan = require('koa-morgan');

//exports.init = app => app.use(logger());
exports.init = app => app.use(morgan('dev'));
