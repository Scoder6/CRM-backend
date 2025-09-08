const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const { getPagination } = require('../utils/pagination');
const { buildRegexSearch } = require('../utils/helpers');

async function createCustomer(req, res, next) {
  try {
    const { name, email, phone, company } = req.body;
    const customer = await Customer.create({ name, email, phone, company, ownerId: req.user.id });
    return res.status(201).json(customer);
  } catch (err) {
    return next(err);
  }
}

async function listCustomers(req, res, next) {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const searchRegex = buildRegexSearch(req.query.search);
    const filter = {};
    if (searchRegex) {
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }
    if (req.user.role !== 'Admin') {
      filter.ownerId = req.user.id;
    }
    const [customers, totalCount] = await Promise.all([
      Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Customer.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalCount / limit) || 1;
    return res.json({ customers, totalPages, currentPage: page, totalCount });
  } catch (err) {
    return next(err);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    if (req.user.role !== 'Admin' && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const leads = await Lead.find({ customerId: customer._id }).sort({ createdAt: -1 });
    return res.json({ ...customer.toObject(), leads });
  } catch (err) {
    return next(err);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    if (req.user.role !== 'Admin' && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { name, email, phone, company } = req.body;
    customer.name = name;
    customer.email = email;
    customer.phone = phone;
    customer.company = company;
    await customer.save();
    return res.json(customer);
  } catch (err) {
    return next(err);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    if (req.user.role !== 'Admin' && String(customer.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await Lead.deleteMany({ customerId: customer._id });
    await customer.deleteOne();
    return res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createCustomer,
  listCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};

