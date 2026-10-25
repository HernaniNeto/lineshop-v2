import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import { formatPrice, getErrorMessage } from '../../utils/format';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // CORREÇÃO: .unwrap() para que erros do servidor caiam no catch
      // (antes mostrava "Produto atualizado" mesmo quando falhava)
      await updateProduct({
        productId,
        name,
        price: Number(price),
        image,
        brand,
        category,
        description,
        countInStock: Number(countInStock),
      }).unwrap();
      toast.success('Produto atualizado');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-dark my-3'>
        Voltar
      </Link>
      <FormContainer>
        <h1>Editar produto</h1>
        {loadingUpdate && <Loader />}
        {image && !isLoading && (
          <img src={image} alt='Pré-visualização' className='img-fluid rounded my-2' style={{ maxHeight: 160 }} />
        )}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{getErrorMessage(error)}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type='text'
                placeholder='Nome'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type='number'
                placeholder='Preço'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
              <small className='text-muted'>
                Exemplo: {formatPrice(price)}
              </small>
            </Form.Group>

            <Form.Group controlId='image' className='my-2'>
              <Form.Label>Imagem</Form.Label>
              <Form.Control
                type='text'
                placeholder='URL da imagem'
                value={image}
                /* CORREÇÃO: antes era onChange={(e) => setImage}, que não fazia nada */
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                onChange={uploadFileHandler}
                type='file'
                accept='image/png, image/jpeg, image/webp'
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type='text'
                placeholder='Marca'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Estoque</Form.Label>
              <Form.Control
                type='number'
                placeholder='Quantidade em estoque'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                type='text'
                placeholder='Categoria'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Descrição'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Atualizar
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
