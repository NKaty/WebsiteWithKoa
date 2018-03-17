const Router = require('koa-router');
const router = new Router();

const home = require('../controllers/index');
const login = require('../controllers/login');
const admin = require('../controllers/admin');
const koaBodyMultipart = require('../middlewares/bodyParser').multipart;

router.get('/', home.getIndex);
router.post('/', home.sendMessage);

router.get('/login', login.getLogin);
router.post('/login', login.signUp);

router.get('/admin', admin.isAdmin, admin.getAdmin);
router.post('/admin/upload', koaBodyMultipart, admin.uploadProduct);
router.post('/admin/skills', admin.updateSkills);

module.exports = router;
