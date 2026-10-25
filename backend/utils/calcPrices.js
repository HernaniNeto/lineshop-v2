// Calcula os valores do pedido NO SERVIDOR.
// Antes, o backend aceitava os preços enviados pelo navegador, o que permitia
// que qualquer pessoa alterasse o total da compra (ex.: pagar R$ 0,01 num PlayStation).
// Mesma regra do carrinho no frontend (frontend/src/utils/cartUtils.js):
//  - frete grátis acima de R$ 100, senão R$ 10
//  - sem imposto

function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2)
}

export function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  )
  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const taxPrice = 0
  const totalPrice = itemsPrice + shippingPrice + taxPrice

  return {
    itemsPrice: addDecimals(itemsPrice),
    shippingPrice: addDecimals(shippingPrice),
    taxPrice: addDecimals(taxPrice),
    totalPrice: addDecimals(totalPrice)
  }
}
