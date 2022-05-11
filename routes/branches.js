const express = require('express');
const router = express.Router();
const controller = require('../controllers/branches')
const tokenValidate = require('../token_validate');

router.get('/', tokenValidate, controller.getAll)
router.post('/', tokenValidate, controller.add)
router.put('/', tokenValidate, controller.edit)

module.exports = router;