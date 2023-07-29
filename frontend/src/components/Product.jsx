import { Card } from "react-bootstrap"
import { Link } from 'react-router-dom'

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" style={{ color: 'black' }}>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>


        <Card.Text as="h3">
          R$ {parseFloat(product.price).toFixed(2)}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
