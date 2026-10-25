import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // CORREÇÃO: o valor do .env chega como texto ("8"); sem Number() e sem um
  // valor padrão, a paginação quebrava (NaN) se a variável não existisse.
  const pageSize = Number(process.env.PAGINATION_LIMIT) || 8
  const page = Number(req.query.pageNumber) || 1

  // CORREÇÃO: escapa caracteres especiais da busca. Antes, procurar algo
  // como "(" ou "*" derrubava a requisição com erro de expressão regular.
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: String(req.query.keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          $options: 'i'
        }
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })

  const products = await Product.find({ ...keyword })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    return res.json(product)
  } else {
    res.status(404)
    throw new Error('Produto não encontrado')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = Number(price);
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = Number(countInStock);

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: 'Produto apagado' });
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});
// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Você já avaliou este produto');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Avaliação adicionada' });
  } else {
    res.status(404);
    throw new Error('Produto não encontrado');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.status(200).json(products);
});

export { 
  getProducts, 
  getProductById, 
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts
 };
