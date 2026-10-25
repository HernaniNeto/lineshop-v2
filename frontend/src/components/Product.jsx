import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import { formatPrice } from '../utils/format'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} alt={product.name} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title' style={{ color: 'black' }}>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} ${product.numReviews === 1 ? 'avaliação' : 'avaliações'}`}
          />
        </Card.Text>

        <Card.Text as='h3'>{formatPrice(product.price)}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
