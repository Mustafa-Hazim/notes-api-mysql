const express = require('express');
const router = express.Router();
const controller = require('../controllers/user')
const tokenValidate = require('../token_validate');

router.get('/', tokenValidate, controller.getAll)
router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/status', tokenValidate, controller.status)

module.exports = router;