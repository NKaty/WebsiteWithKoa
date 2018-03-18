const path = require('path');

const config = {
  mail: {
    subject: 'Сообщение с сайта',
    smtp: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'webinar.loftschool@gmail.com',
        pass: ''
      }
    }
  },
  session: {
    settingsGS: {
      key: 'key',
      rolling: false,
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: null,
        overwrite: true,
        signed: true
      }
    },
    settingsS: {
      key: 'key',
      overwrite: true,
      signed: true,
      httpOnly: true,
      maxAge: null,
      rolling: false,
      renew: false
    },
    secret: 'keyboard cat'
  },
  server: {
    port: process.env.PORT || 3001
  },
  upload: {
    formidable: {
      uploadDir: `${path.join(process.cwd(), 'public', 'images', 'products')}`,
      multiples: false
    },
    multipart: true
  },
  middleware: ['favicon', 'static', 'logger', 'templates', 'errors', 'bodyParser', 'session', 'db']
};

module.exports = config;
