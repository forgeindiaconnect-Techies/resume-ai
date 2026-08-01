const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Get all templates
router.get('/', templateController.getTemplates);

// Get template by ID
router.get('/:id', templateController.getTemplateById);

// Create template
router.post('/', templateController.createTemplate);

// Update template
router.put('/:id', templateController.updateTemplate);

// Delete template
router.delete('/:id', templateController.deleteTemplate);

// Use template
router.post('/:id/use', templateController.createResumeFromTemplate);

module.exports = router;
