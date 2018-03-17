const session = require('koa-generic-session');
const config = require('../config');

exports.init = app => {
  app.keys = [config.session.secret];
  app.use(session(config.session.settingsGS));
};

// const session = require('koa-session');
// const config = require('../config');
//
// exports.init = app => {
//   app.keys = [config.session.secret];
//   app.use(session(config.session.settingsS, app));
// };
