if (process.env.TRACE) {
  require('./libs/trace');
}
const path = require('path');
const router = require('./routes');
const config = require('./config');
const Koa = require('koa');

const app = module.exports = new Koa();

config.middleware.forEach(mw => require(path.join(__dirname, 'middlewares', mw)).init(app));

app.use(router.routes());

app.listen(config.server.port, () => console.log(`listening on port ${config.server.port}`));
