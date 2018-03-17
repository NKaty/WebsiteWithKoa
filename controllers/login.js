const passwordHash = require('password-hash');

exports.getLogin = async ctx => {
  ctx.set('Content-Type', 'text/html');
  ctx.body = ctx.pug.render('pages/login');
};

exports.signUp = async ctx => {
  try {
    await ctx.regenerateSession();
  } catch (err) {
    ctx.throw(500, 'При входе на сайт произошля ошибка');
  }
  const username = ctx.request.body.email;
  const password = ctx.request.body.password;
  const user = await ctx.db.get('users')
    .find({name: username})
    .value();

  if (user) {
    ctx.set('Content-Type', 'text/html');
    if (passwordHash.verify(password, user.password)) {
      if (user.name === 'admin@admin') {
        ctx.session.isAdmin = true;
        // Можно сразу отправлять админа на страничку админки
        // res.redirect('/admin');
        ctx.body = ctx.pug.render('pages/login',
          {msglogin: 'Вы успешно вошли на сайт!', status: 'Ok'});
      } else {
        ctx.body = ctx.pug.render('pages/login',
          {msglogin: 'Вы успешно вошли на сайт!', status: 'Ok'});
      }
    } else {
      ctx.body = ctx.pug.render('pages/login',
        {msglogin: 'Вы ввели неправильное имя пользователя или пароль!', status: 'Error'});
    }
  } else {
    const hashedPassword = passwordHash.generate(password);
    try {
      await ctx.db.get('users')
        .push({name: username, password: hashedPassword})
        .write();
    } catch (err) {
      console.error(err);
      ctx.throw(500, 'При регистрации произошля ошибка');
      // res.render('pages/login',
      //   {msglogin: `При регистрации произошля ошибка. ${err}`, status: 'Error'});
    }
    ctx.set('Content-Type', 'text/html');
    ctx.body = ctx.pug.render('pages/login',
      {msglogin: 'Вы успешно зарегистрировались на сайте!', status: 'Ok'});
  }
};
