import { useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Loader from "../components/Loader"
import Message from "../components/Message"
import Meta from '../components/Meta'
import { useGetProductDetailsQuery } from "../slices/productsApiSlice"
import { addToCart } from '../slices/cartSlice'

const ProductScreen = () => {
  const { id: productId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [qty, setQty] = useState(1);



  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  }


  return (
    <>
      <Link className="btn btn-dark my-3" to="/">
        Voltar
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>Preço: R$ {parseFloat(product.price).toFixed(2)}</ListGroup.Item>

                <ListGroupItem>Descrição: {product.description}
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroupItem>
                    <Row>
                      <Col>Preço:</Col>
                      <Col>
                        <strong>R$ {product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong> {product.countInStock > 0 ? 'Em estoque' :
                          'Sem estoque'}</strong>
                      </Col>
                    </Row>
                  </ListGroupItem>

                  {/* Qty Select */}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroupItem>
                    <Button
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Adicionar ao carrinho
                    </Button>
                  </ListGroupItem>

                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}


    </>
  )
}

export default ProductScreen
