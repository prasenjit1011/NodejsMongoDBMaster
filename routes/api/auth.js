const express   = require('express');
const router    = express.Router();

const isAuth    = require('../../middleware/jwtIsAuth');
const authApi   = require('../../controllers/api/authApi');

router.get('/api/login', authApi.getLogin);
router.get('/api/account', isAuth, authApi.getAccount);

module.exports  = router;