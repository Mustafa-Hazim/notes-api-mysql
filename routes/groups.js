const express = require('express');
const router = express.Router();
const controller = require('../controllers/groups')
const tokenValidate = require('../token_validate');

router.get('/', tokenValidate, [controller.getGroupBranches, controller.getAll])
router.post('/', tokenValidate, controller.add)
router.patch('/', tokenValidate, controller.edit)

module.exports = router;