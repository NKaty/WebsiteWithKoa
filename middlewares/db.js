const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const adapter = new FileAsync('./db.json');

exports.init = app => app.use(async (ctx, next) => {
  app.context.db = await low(adapter);
  await next();
});
