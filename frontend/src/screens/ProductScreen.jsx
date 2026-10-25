import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import Rating from '../components/Rating'
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation
} from '../slices/productsApiSlice'
import { addToCart } from '../slices/cartSlice'
import { formatPrice, formatDate, getErrorMessage } from '../utils/format'

const ProductScreen = () => {
  const { id: productId } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const {
    data: product,
    isLoading,
    refetch,
    error
  } = useGetProductDetailsQuery(productId)

  const { userInfo } = useSelector(state => state.auth)

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation()

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }))
    navigate('/cart')
  }

  // A parte de avaliações já existia no backend e no productsApiSlice,
  // mas não tinha tela. Ela foi concluída aqui.
  const submitReviewHandler = async e => {
    e.preventDefault()
    if (!rating) {
      toast.error('Escolha uma nota')
      return
    }
    try {
      await createReview({ productId, rating, comment }).unwrap()
      refetch()
      toast.success('Avaliação enviada')
      setRating(0)
      setComment('')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <>
      <Link className='btn btn-dark my-3' to='/'>
        Voltar
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{getErrorMessage(error)}</Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} ${product.numReviews === 1 ? 'avaliação' : 'avaliações'}`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Preço: {formatPrice(product.price)}</ListGroup.Item>
                <ListGroup.Item>Descrição: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Preço:</Col>
                      <Col>
                        <strong>{formatPrice(product.price)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0 ? 'Em estoque' : 'Sem estoque'}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {/* Seletor de quantidade */}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qtd.</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={e => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(x => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className='w-100'
                      type='button'
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Adicionar ao carrinho
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className='review'>
            <Col md={6}>
              <h2>Avaliações</h2>
              {product.reviews.length === 0 && (
                <Message>Nenhuma avaliação ainda</Message>
              )}
              <ListGroup variant='flush'>
                {product.reviews.map(review => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{formatDate(review.createdAt)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Avalie este produto</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitReviewHandler}>
                      <Form.Group className='my-2' controlId='rating'>
                        <Form.Label>Nota</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={e => setRating(Number(e.target.value))}
                        >
                          <option value=''>Selecione...</option>
                          <option value='1'>1 - Ruim</option>
                          <option value='2'>2 - Regular</option>
                          <option value='3'>3 - Bom</option>
                          <option value='4'>4 - Muito bom</option>
                          <option value='5'>5 - Excelente</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='my-2' controlId='comment'>
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          required
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type='submit'
                        variant='primary'
                      >
                        Enviar avaliação
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      <Link to={`/login?redirect=/product/${productId}`}>
                        Faça login
                      </Link>{' '}
                      para escrever uma avaliação
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
