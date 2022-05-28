const express = require('express');
const router = express.Router();
const controller = require('../controllers/tags')
const tokenValidate = require('../token_validate');

router.get('/', tokenValidate, [controller.getTagBranches, controller.getAll])
router.post('/', tokenValidate, controller.add)
router.patch('/', tokenValidate, controller.edit)
router.get('/search', tokenValidate, controller.SearchTagByName)
router.delete('/', tokenValidate, controller.deleteTag)

module.exports = router;