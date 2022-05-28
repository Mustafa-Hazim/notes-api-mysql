const express = require('express');
const router = express.Router();
const controller = require('../controllers/branches')
const tokenValidate = require('../token_validate');

router.get('/', tokenValidate, [
    controller.getLatest,
    controller.getById,
    controller.getAll,
])
router.get('/root', tokenValidate, controller.getRootBranches)
router.post('/', tokenValidate, controller.add)
router.patch('/', tokenValidate, controller.edit)
router.delete('/', tokenValidate, controller.fullyDeleteBranch)
router.get('/nested', tokenValidate, controller.getNested)
router.post('/toggle-tag', tokenValidate, controller.toggleBranchTag)
router.post('/toggle-group', tokenValidate, controller.toggleBranchGroup)
router.post('/toggle-person', tokenValidate, controller.toggleBranchPerson)
router.get('/branch-tags', tokenValidate, controller.getBranchTags)
router.get('/branch-groups', tokenValidate, controller.getBranchGroups)
router.get('/branch-people', tokenValidate, controller.getBranchPeople)
router.get('/origin', tokenValidate, controller.getBranchOrigin)
router.get('/search', tokenValidate, controller.searchBranchByName)

module.exports = router;