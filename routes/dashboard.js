const router = require('express').Router();
const Joi = require('joi');
const validate = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');

const emptySchema = Joi.object({ body: Joi.object({}), params: Joi.object({}), query: Joi.object({}) });

router.get('/stats', authenticate, validate(emptySchema), getStats);

module.exports = router;

