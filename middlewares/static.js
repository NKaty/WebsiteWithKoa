const serve = require('koa-static');
const path = require('path');

exports.init = app => app.use(serve(path.join(process.cwd(), 'public'), { maxage: 10 * 24 * 60 * 60 * 1000 }));
