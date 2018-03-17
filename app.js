const path = require('path');
const router = require('./routes');
const config = require('./config');
const Koa = require('koa');

const app = module.exports = new Koa();

config.middleware.forEach(mw => require(path.join(__dirname, 'middlewares', mw)).init(app));

app.use(router.routes());

// admin@admin (пароль 111) - для того, чтоб попасть в админку (и никто другой под этим именем не зарегистрировался)
// app.use(async (ctx, next) => {
//   ctx.db.defaults({ users:
//       [{ name: 'admin@admin', password: 'sha1$8f53e4db$1$55f19543380d2775c86c51f6cd1a7e98e3cbc31d' }] }).write();
// });

app.listen(config.server.port, () => console.log(`listening on port ${config.server.port}`));
