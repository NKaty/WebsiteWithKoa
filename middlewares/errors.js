const { logInfo, logError } = require('../libs/winston')(module);

exports.init = app => app.use(async (ctx, next) => {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) ctx.throw(404);
  } catch (e) {
    if (e.status) {
      ctx.status = e.status;
      logInfo.info(e.message);
      ctx.body = ctx.pug.render('pages/error', { message: e.message, status: ctx.status });
    } else {
      if (e.message.slice(0, 20) === 'maxFileSize exceeded') {
        ctx.status = 413;
        logInfo.info(e.message);
        ctx.body = ctx.pug.render('pages/error', { message: 'Превышен максимальный размер файла (2 мегабайта)', status: ctx.status });
        return;
      }
      if (process.env.DEV) {
        ctx.status = 500;
        logError.error(e.message, e.stack);
        ctx.body = ctx.pug.render('pages/error', {message: e.message, status: ctx.status, stack: e.stack});
      } else {
        ctx.status = 500;
        logError.error(e.message, e.stack);
        ctx.body = ctx.pug.render('pages/error', {message: 'Server error', status: ctx.status});
      }
    }
  }
});
