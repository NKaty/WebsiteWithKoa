const Pug = require('koa-pug');
const path = require('path');

exports.init = app => {
  app.context.pug = new Pug({
    viewPath: `${path.join(process.cwd(), 'views')}`,
    basedir: `${path.join(process.cwd(), 'views')}`,
    app: app
  });
};
