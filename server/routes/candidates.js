const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// GET all candidates
router.get('/', candidateController.getCandidates);

// POST new candidate (from analyzer)
router.post('/', candidateController.addCandidate);

// PUT update candidate (status, interview details)
router.put('/:id', candidateController.updateCandidate);

// PATCH update candidate (status, interview details)
router.patch('/:id', candidateController.updateCandidate);

// DELETE candidate
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;
