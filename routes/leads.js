const router = require('express').Router();
const Joi = require('joi');
const validate = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { createLead, listLeads, updateLead, deleteLead } = require('../controllers/leadController');
const { ensureCustomerOwner, ensureLeadOwner } = require('../middleware/ownership');
const { LEAD_STATUSES } = require('../utils/constants');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required();

const createSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(2).max(200).required(),
    description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid(...LEAD_STATUSES).optional(),
    value: Joi.number().min(0).optional(),
  }),
  params: Joi.object({ customerId: objectId }),
  query: Joi.object({}),
});

const listSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({ customerId: objectId }),
  query: Joi.object({ status: Joi.string().valid(...LEAD_STATUSES).optional() }),
});

const updateSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(2).max(200).required(),
    description: Joi.string().allow('', null).optional(),
    status: Joi.string().valid(...LEAD_STATUSES).required(),
    value: Joi.number().min(0).required(),
  }),
  params: Joi.object({ id: objectId }),
  query: Joi.object({}),
});

const idSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({ id: objectId }),
  query: Joi.object({}),
});

router.post('/customers/:customerId/leads', authenticate, validate(createSchema), ensureCustomerOwner, createLead);
router.get('/customers/:customerId/leads', authenticate, validate(listSchema), ensureCustomerOwner, listLeads);
router.put('/leads/:id', authenticate, validate(updateSchema), ensureLeadOwner, updateLead);
router.delete('/leads/:id', authenticate, validate(idSchema), ensureLeadOwner, deleteLead);

module.exports = router;

