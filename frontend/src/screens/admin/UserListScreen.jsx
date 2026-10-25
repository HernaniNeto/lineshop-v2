import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/format';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Tem certeza que deseja apagar este usuário?')) {
      try {
        // CORREÇÃO: sem .unwrap(), ao tentar apagar um admin aparecia
        // "usuário apagado" mesmo o servidor recusando
        await deleteUser(id).unwrap();
        toast.success('Usuário apagado');
        refetch();
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    }
  };

  return (
    <>
      <h1>Usuários</h1>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{getErrorMessage(error)}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <>
                    <LinkContainer
                      to={`/admin/user/${user._id}/edit`}
                      style={{ marginRight: '10px' }}
                    >
                      <Button variant='light' className='btn-sm'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    {/* O servidor não permite apagar administradores */}
                    {!user.isAdmin && (
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    )}
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

      )}
    </>
  );
};

export default UserListScreen;
