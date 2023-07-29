import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{ marginTop: '50px', position: 'relative' }}>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <p>Lineshop &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )


}

export default Footer
