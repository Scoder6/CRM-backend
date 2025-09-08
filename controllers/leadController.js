const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const { LEAD_STATUSES } = require('../utils/constants');

async function createLead(req, res, next) {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    if (req.user.role !== 'Admin' && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { title, description, status, value } = req.body;
    if (status && !LEAD_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const lead = await Lead.create({ customerId, title, description, status, value });
    return res.status(201).json(lead);
  } catch (err) {
    return next(err);
  }
}

async function listLeads(req, res, next) {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    if (req.user.role !== 'Admin' && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const filter = { customerId };
    if (req.query.status) filter.status = req.query.status;
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    return res.json(leads);
  } catch (err) {
    return next(err);
  }
}

async function updateLead(req, res, next) {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate('customerId');
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const customer = lead.customerId;
    if (req.user.role !== 'Admin' && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { title, description, status, value } = req.body;
    if (status && !LEAD_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    lead.title = title;
    lead.description = description;
    lead.status = status;
    lead.value = value;
    await lead.save();
    return res.json(lead);
  } catch (err) {
    return next(err);
  }
}

async function deleteLead(req, res, next) {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate('customerId');
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const customer = lead.customerId;
    if (req.user.role !== 'Admin' && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await lead.deleteOne();
    return res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createLead, listLeads, updateLead, deleteLead };

