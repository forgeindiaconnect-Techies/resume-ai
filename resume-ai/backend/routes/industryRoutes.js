const express = require('express');
const router = express.Router();
const industryController = require('../controllers/industryController');

// Industry routes
router.route('/industries')
  .get(industryController.getAllIndustries)
  .post(industryController.createIndustry);

router.route('/industries/:id')
  .put(industryController.updateIndustry)
  .delete(industryController.deleteIndustry);

// Resume Examples routes
router.route('/resume-examples')
  .get(industryController.getAllResumeExamples)
  .post(industryController.createResumeExample);

router.route('/resume-examples/:id')
  .get(industryController.getExampleById)
  .put(industryController.updateResumeExample)
  .delete(industryController.deleteResumeExample);

router.route('/industries/:industryId/examples')
  .get(industryController.getExamplesByIndustry);

module.exports = router;
