const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/resumeExampleController');

// GET search examples
router.get('/search', exampleController.searchResumeExamples);

// GET examples by category
router.get('/category/:category', exampleController.getResumeExamplesByCategory);

// GET all examples & POST create example
router.route('/')
  .get(exampleController.getAllResumeExamples)
  .post(exampleController.createResumeExample);

// GET, PUT, DELETE example by ID
router.route('/:id')
  .get(exampleController.getResumeExampleById)
  .put(exampleController.updateResumeExample)
  .delete(exampleController.deleteResumeExample);

module.exports = router;
