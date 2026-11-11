const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/start', optionalAuth, gameController.startGame);
router.post('/submit', optionalAuth, gameController.submitAnswer);
router.post('/timeout', optionalAuth, gameController.handleTimeout);
router.post('/hint', optionalAuth, gameController.getAiHint);
router.post('/powerup/freeze', optionalAuth, gameController.useTimeFreeze);

module.exports = router;
