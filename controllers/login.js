const passwordHash = require('password-hash');

exports.getLogin = async ctx => {
  ctx.set('Content-Type', 'text/html');
  ctx.body = ctx.pug.render('pages/login');
};

exports.signUp = async ctx => {
  await ctx.regenerateSession();

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
        ctx.redirect('/admin');
        // ctx.body = ctx.pug.render('pages/login',
        //   {msglogin: 'Вы успешно вошли на сайт!', status: 'Ok'});
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
    await ctx.db.get('users')
      .push({name: username, password: hashedPassword})
      .write();

    ctx.set('Content-Type', 'text/html');
    ctx.body = ctx.pug.render('pages/login',
      {msglogin: 'Вы успешно зарегистрировались на сайте!', status: 'Ok'});
  }
};
