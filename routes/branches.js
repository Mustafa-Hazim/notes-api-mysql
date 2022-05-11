const express = require('express');
const router = express.Router();
const controller = require('../controllers/branches')
const tokenValidate = require('../token_validate');

router.get('/', tokenValidate, controller.getAll)
router.post('/', tokenValidate, controller.add)
router.patch('/', tokenValidate, controller.edit)
router.get('/nested', tokenValidate, controller.getNested)
router.post('/toggle-tag', tokenValidate, controller.toggleBranchTag)
router.post('/toggle-group', tokenValidate, controller.toggleBranchGroup)
router.post('/toggle-person', tokenValidate, controller.toggleBranchPerson)

module.exports = router;