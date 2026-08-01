const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.route('/templates')
  .get(templateController.getTemplates)
  .post(templateController.createTemplate);

router.route('/templates/:id')
  .put(templateController.updateTemplate)
  .delete(templateController.deleteTemplate);

module.exports = router;
