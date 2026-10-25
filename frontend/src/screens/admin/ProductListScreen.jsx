import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom'
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate'
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import { formatPrice, getErrorMessage } from '../../utils/format';

const ProductListScreen = () => {
  const { pageNumber } = useParams()

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Produto apagado');
        refetch();
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm('Tem certeza de que pretende criar um novo produto?')) {
      try {
        await createProduct().unwrap();
        toast.success('Produto criado — clique em editar para preencher');
        refetch();
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Produtos</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Criar Produto
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{getErrorMessage(error)}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOME</th>
                <th>PREÇO</th>
                <th>CATEGORIA</th>
                <th>MARCA</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  {/* CORREÇÃO: o ID aparecia duas vezes e desalinhava a tabela */}
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>

                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />

        </>
      )}
    </>
  );
};

export default ProductListScreen;
