const Customer = require('./customer.model');

exports.getAll = async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
};

exports.getById = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Not found' });
  res.json(customer);
};

exports.create = async (req, res) => {
  try {    
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!customer) return res.status(404).json({ message: 'Not found' });
  res.json(customer);
};

exports.remove = async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};
