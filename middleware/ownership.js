const Customer = require('../models/Customer');
const Lead = require('../models/Lead');

async function ensureCustomerOwner(req, res, next) {
  try {
    const { customerId, id } = req.params;
    const targetCustomerId = customerId || id;
    const customer = await Customer.findById(targetCustomerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    if (req.user.role !== 'Admin' && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.customer = customer;
    return next();
  } catch (err) {
    return next(err);
  }
}

async function ensureLeadOwner(req, res, next) {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate('customerId');
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const customer = lead.customerId;
    if (req.user.role !== 'Admin' && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.lead = lead;
    req.customer = customer;
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { ensureCustomerOwner, ensureLeadOwner };

