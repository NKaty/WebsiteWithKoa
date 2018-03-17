exports.init = app => app.use(async (ctx, next) => {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) ctx.throw(404);
  } catch (e) {
    if (e.status) {
      ctx.status = e.status;
      ctx.body = ctx.pug.render('pages/error', { message: e.message, status: ctx.status });
    } else {
      ctx.status = 500;
      console.error(e.message, e.stack);
      ctx.body = ctx.pug.render('pages/error', { message: 'Server error', status: ctx.status });
    }
  }
});
