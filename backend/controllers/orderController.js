import asyncHandler from '../middleware/asyncHandler.js'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import { calcPrices } from '../utils/calcPrices.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body

  // CORREÇÃO: se orderItems não viesse, o código quebrava no .map (erro 500)
  if (!orderItems || orderItems.length === 0) {
    res.status(400)
    throw new Error('Nenhum item no pedido')
  }

  // CORREÇÃO DE SEGURANÇA: antes os preços vinham do navegador e eram salvos
  // sem conferência. Agora buscamos cada produto no banco e usamos o preço real.
  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map(x => x._id) }
  })

  const dbOrderItems = orderItems.map(itemFromClient => {
    const matchingItemFromDB = itemsFromDB.find(
      itemFromDB => itemFromDB._id.toString() === itemFromClient._id
    )

    if (!matchingItemFromDB) {
      res.status(404)
      throw new Error(`Produto não encontrado: ${itemFromClient._id}`)
    }

    return {
      name: matchingItemFromDB.name,
      image: matchingItemFromDB.image,
      qty: Number(itemFromClient.qty),
      product: matchingItemFromDB._id,
      price: matchingItemFromDB.price
    }
  })

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calcPrices(dbOrderItems)

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  })

  const createdOrder = await order.save()

  res.status(201).json(createdOrder)
})

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1
  })
  res.status(200).json(orders)
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (dono do pedido ou admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (!order) {
    res.status(404)
    throw new Error('Pedido não encontrado')
  }

  // CORREÇÃO DE SEGURANÇA: antes qualquer usuário logado podia ver o pedido
  // (nome, email e endereço) de qualquer outra pessoa só trocando o ID na URL.
  if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Não autorizado a ver este pedido')
  }

  res.status(200).json(order)
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error('Pedido não encontrado')
  }

  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Não autorizado a pagar este pedido')
  }

  if (order.isPaid) {
    res.status(400)
    throw new Error('Este pedido já foi pago')
  }

  // Confere se o valor pago no PayPal bate com o total do pedido
  const paidValue = req.body?.purchase_units?.[0]?.amount?.value
  if (paidValue !== undefined && Number(paidValue) !== Number(order.totalPrice)) {
    res.status(400)
    throw new Error('Valor pago diferente do total do pedido')
  }

  order.isPaid = true
  order.paidAt = Date.now()
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    // CORREÇÃO: quebrava (erro 500) se o PayPal não mandasse "payer"
    email_address: req.body.payer?.email_address
  }

  const updatedOrder = await order.save()

  res.status(200).json(updatedOrder)
})

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Pedido não encontrado');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .sort({ createdAt: -1 })
  res.status(200).json(orders)
})

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders
}
