const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// 1. Categories
router.route('/admin/categories')
  .get(templateController.getCategories)
  .post(templateController.createCategory);

router.route('/admin/categories/:id')
  .put(templateController.updateCategory)
  .delete(templateController.deleteCategory);

// 2. Job Roles
router.route('/admin/job-roles')
  .get(templateController.getJobRoles)
  .post(templateController.createJobRole);

router.route('/admin/job-roles/:id')
  .put(templateController.updateJobRole)
  .delete(templateController.deleteJobRole);

// 3. Resume Templates
router.route('/admin/templates')
  .get(templateController.getTemplates)
  .post(templateController.createTemplate);

router.route('/admin/templates/:id')
  .put(templateController.updateTemplate)
  .delete(templateController.deleteTemplate);

// 4. Resume Sections
router.route('/admin/sections')
  .get(templateController.getSections)
  .post(templateController.createSection);

router.route('/admin/sections/:id')
  .delete(templateController.deleteSection);

// 5. Public Details
router.get('/template/:slug', templateController.getTemplateBySlug);

module.exports = router;
