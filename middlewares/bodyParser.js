const koaBody = require('koa-body');
const config = require('../config');

exports.init = app => app.use(koaBody());

exports.multipart = koaBody(config.upload);
