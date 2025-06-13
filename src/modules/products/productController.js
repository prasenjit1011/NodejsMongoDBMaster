let products = [];
let idCounter = 1;

exports.getAll = (req, res) => {
  res.json(products);
};

exports.getById = (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

exports.create = (req, res) => {
  const { name, price } = req.body;
  const newProduct = { id: idCounter++, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.update = (req, res) => {
  const { name, price } = req.body;
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  product.name = name;
  product.price = price;
  res.json(product);
};

exports.remove = (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  products.splice(index, 1);
  res.json({ message: "Deleted" });
};

exports.reset = () => {
  products = [];
  idCounter = 1;
};
