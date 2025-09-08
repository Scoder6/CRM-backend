const router = require('express').Router();
const Joi = require('joi');
const validate = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const {
  createCustomer,
  listCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

const idParam = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required();

const createOrUpdateSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('', null).optional(),
    company: Joi.string().allow('', null).optional(),
  }),
  params: Joi.object({ id: idParam.optional() }),
  query: Joi.object({}),
});

const listSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({}),
  query: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().allow('', null).optional(),
  }),
});

const idSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({ id: idParam }),
  query: Joi.object({}),
});

router.post('/', authenticate, validate(createOrUpdateSchema), createCustomer);
router.get('/', authenticate, validate(listSchema), listCustomers);
router.get('/:id', authenticate, validate(idSchema), getCustomerById);
router.put('/:id', authenticate, validate(createOrUpdateSchema), updateCustomer);
router.delete('/:id', authenticate, validate(idSchema), deleteCustomer);

module.exports = router;

