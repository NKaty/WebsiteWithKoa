const fs = require('fs');
const path = require('path');
const config = require('../config');
const util = require('util');

exports.isAdmin = async (ctx, next) => {
  console.log(ctx.cookies.get('key'));
  if (ctx.session.isAdmin) {
    await next();
    return;
  }
  // ctx.throw(401, 'У вас нет прав для входа на эту страницу');
  ctx.redirect('/');
};

exports.getAdmin = async ctx => {
  ctx.set('Content-Type', 'text/html');
  ctx.body = ctx.pug.render('pages/admin');
};

exports.updateSkills = async ctx => {
  const age = +ctx.request.body.age;
  const concerts = +ctx.request.body.concerts;
  const cities = +ctx.request.body.cities;
  const years = +ctx.request.body.years;
  if (!ctx.request.body.age || !ctx.request.body.concerts ||
    !ctx.request.body.cities || !ctx.request.body.years ||
    age < 0 || concerts < 0 || cities < 0 || years < 0) {
    ctx.body = ctx.pug.render('pages/admin',
      { msgskill: 'Все поля должны быть заполнены и неотрицательны!',
        status: 'Error',
        ageField: age || '',
        concertsField: concerts || '',
        citiesField: cities || '',
        yearsField: years });
    return;
  }
  const numbers = [age, concerts, cities, years];
  try {
    const skills = await ctx.db.get('skills');
    await numbers.forEach((item, index) => {
      skills.find({ id: index })
        .assign({ number: item })
        .write();
    });
  } catch (err) {
    console.error(err);
    ctx.throw(500, 'Произошла ошибка при записи в базу данных!');
  }
  ctx.body = ctx.pug.render('pages/admin', { msgskill: 'Счетчики обновлены!', status: 'Ok' });
};

module.exports.uploadProduct = async ctx => {
  const upload = config.upload.formidable.uploadDir;
  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  const renamePromise = util.promisify(fs.rename);
  const unlinkPromise = util.promisify(fs.unlink);

  const file = ctx.request.body.files.photo;
  const fields = ctx.request.body.fields;

  if (file.name === '') {
    ctx.body = ctx.pug.render('pages/admin',
      { msgfile: 'Вы не указали файл для загрузки!',
        status: 'Error',
        productName: fields.name || '',
        productPrice: fields.price || '' });
    return;
  }

  if (file.size === 0) {
    await unlinkPromise(file.path);
    ctx.body = ctx.pug.render('pages/admin',
      { msgfile: 'Файл для загрузки пуст!',
        status: 'Error',
        productName: fields.name || '',
        productPrice: fields.price || '' });
    return;
  }

  if (!fields.name) {
    try {
      await unlinkPromise(file.path);
    } catch (err) {
      console.log(err);
    }
    ctx.body = ctx.pug.render('pages/admin',
      { msgfile: 'Вы не указали описание товара!',
        status: 'Error',
        productPrice: fields.price });
    return;
  }

  if (!fields.price) {
    await unlinkPromise(file.path);
    ctx.body = ctx.pug.render('pages/admin',
      { msgfile: 'Вы не указали цену товара!',
        status: 'Error',
        productName: fields.name });
    return;
  }

  const fileName = path.join(upload, file.name);
  try {
    await renamePromise(file.path, fileName);
    await unlinkPromise(fileName);
  } catch (err) {
    console.error(err);
    ctx.throw(500, 'Произошла ошибка при переименовании фотографии продукта!');
  }
  const dir = path.join('/images', 'products', file.name);
  try {
    await ctx.db.get('products')
      .push({ src: dir, name: fields.name, price: fields.price })
      .write();
  } catch (err) {
    console.error(err);
    ctx.throw(500, 'Произошла ошибка при записи в базу данных!');
  }
  ctx.body = ctx.pug.render('pages/admin', { msgfile: 'Товар добавлен в каталог!', status: 'Ok' });
};
