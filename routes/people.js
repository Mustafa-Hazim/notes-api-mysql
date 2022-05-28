const express = require('express');
const router = express.Router();
const controller = require('../controllers/people')
const tokenValidate = require('../token_validate');

router.get('/', tokenValidate, [controller.getPersonBranches, controller.getAll])
router.post('/', tokenValidate, controller.add)
router.patch('/', tokenValidate, controller.edit)
router.get('/search', tokenValidate, controller.SearchPersonByName)
router.delete('/', tokenValidate, controller.deletePerson)

module.exports = router;