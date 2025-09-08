const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const { LEAD_STATUSES } = require('../utils/constants');

async function getStats(req, res, next) {
  try {
    const match = {};
    const customerMatch = {};
    if (req.user.role !== 'Admin') {
      customerMatch.ownerId = req.user.id;
      match.customerId = { $in: (await Customer.find(customerMatch).select('_id')).map((c) => c._id) };
    }

    const [totalCustomers, totalLeads, leadsByStatusAgg, totalValueAgg] = await Promise.all([
      Customer.countDocuments(customerMatch),
      Lead.countDocuments(match),
      Lead.aggregate([
        { $match: match },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: match },
        { $group: { _id: null, value: { $sum: '$value' } } },
      ]),
    ]);

    const leadsByStatus = LEAD_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    leadsByStatusAgg.forEach((row) => { leadsByStatus[row._id] = row.count; });
    const totalValue = totalValueAgg[0]?.value || 0;

    return res.json({ totalCustomers, totalLeads, leadsByStatus, totalValue });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getStats };

