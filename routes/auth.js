const router = require('express').Router();
const Joi = require('joi');
const validate = require('../middleware/validation');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string().valid('Admin', 'User').optional(),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

const updateProfileSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
  }),
  params: Joi.object({}),
  query: Joi.object({}),
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Profile routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

// Helpful GET handlers for browser checks (method guidance)
router.get('/login', (req, res) => res.status(405).json({ error: 'Use POST /api/auth/login' }));
router.get('/register', (req, res) => res.status(405).json({ error: 'Use POST /api/auth/register' }));

module.exports = router;

