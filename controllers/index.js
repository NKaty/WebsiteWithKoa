const nodemailer = require('nodemailer');
const config = require('../config');

exports.getIndex = async ctx => {
  const products = await ctx.db.get('products').value();
  const skills = await ctx.db.get('skills').value();
  ctx.set('Content-Type', 'text/html');
  ctx.body = ctx.pug.render('pages/index', { products: products, skills: skills });
};

exports.sendMessage = async ctx => {
  const products = await ctx.db.get('products').value();
  const skills = await ctx.db.get('skills').value();
  const body = ctx.request.body;

  if (!body.name || !body.email) {
    ctx.set('Content-Type', 'text/html');
    ctx.body = ctx.pug.render('pages/index',
      { msgemail: 'Поля имя и email должны быть заполнены!',
        status: 'Error',
        anchor: 'form-email',
        fromName: body.name || '',
        fromEmail: body.email || '',
        messageContent: body.message || '',
        products: products,
        skills: skills });
    return;
  }

  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `${body.name} ${body.email}`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: body.message.trim().slice(0, 500) + `\n Отправлено с: <${body.email}>`
  };

  await transporter.sendMail(mailOptions);

  ctx.set('Content-Type', 'text/html');
  ctx.body = ctx.pug.render('pages/index',
    { msgemail: 'Письмо успешно отправлено!',
      status: 'Ok',
      anchor: 'form-email',
      products: products,
      skills: skills });
};
