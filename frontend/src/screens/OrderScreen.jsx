import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';
import {
  formatPrice,
  formatDateTime,
  getErrorMessage,
} from '../utils/format';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    // CORREÇÃO: "paypal?.clientId" — antes, se a resposta viesse vazia,
    // a tela inteira quebrava ao ler "paypal.clientId".
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'BRL',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        // CORREÇÃO: sem o .unwrap() os erros do servidor eram ignorados e
        // aparecia "Pagamento realizado" mesmo quando falhava.
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success('Pagamento realizado com sucesso');
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  function onError(err) {
    toast.error(getErrorMessage(err));
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice.toFixed(2), currency_code: 'BRL' },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Pedido marcado como entregue');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    // CORREÇÃO: antes era {error} — um objeto — o que fazia o React quebrar
    // a página inteira ("Objects are not valid as a React child").
    <Message variant='danger'>{getErrorMessage(error)}</Message>
  ) : (
    <>
      <h1>Pedido {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Envio</h2>
              <p>
                <strong>Nome: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Endereço: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Entregue em {formatDateTime(order.deliveredAt)}
                </Message>
              ) : (
                <Message variant='danger'>Ainda não entregue</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Método de pagamento</h2>
              <p>
                <strong>Método: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  Pago em {formatDateTime(order.paidAt)}
                </Message>
              ) : (
                <Message variant='danger'>Pagamento não efetuado</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Itens do pedido</h2>
              {order.orderItems.length === 0 ? (
                <Message>O pedido está vazio</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {/* CORREÇÃO: antes era item.qty * item.price.toFixed(2),
                              que formatava só o preço e não o resultado */}
                          {item.qty} x {formatPrice(item.price)} ={' '}
                          {formatPrice(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Resumo do pedido</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Itens</Col>
                  <Col>{formatPrice(order.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Envio</Col>
                  <Col>{formatPrice(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{formatPrice(order.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {errorPayPal ? (
                    <Message variant='danger'>
                      Não foi possível carregar o PayPal
                    </Message>
                  ) : isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='w-100'
                      onClick={deliverOrderHandler}
                    >
                      Marcar como entregue
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
