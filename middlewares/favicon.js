const favicon = require('koa-favicon');
const path = require('path');

exports.init = app => app.use(favicon(path.join(process.cwd(), 'public', 'images', 'favicon.ico')));
