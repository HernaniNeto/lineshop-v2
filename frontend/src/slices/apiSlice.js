import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants'
import { logout } from './authSlice'

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL })

// CORREÇÃO: o login fica salvo no localStorage, mas o cookie do servidor
// expira em 30 dias. Quando expirava, o site continuava mostrando o usuário
// "logado" e todas as chamadas falhavam com 401. Agora, se o servidor
// responder 401, o usuário é deslogado no frontend e pode entrar de novo.
async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra)
  if (result.error && result.error.status === 401) {
    api.dispatch(logout())
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  // CORREÇÃO: as "tags" usadas nos endpoints ('Products', 'Users') não
  // batiam com as declaradas aqui, então as listas não se atualizavam
  // sozinhas depois de criar/editar/apagar.
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: builder => ({})
})
