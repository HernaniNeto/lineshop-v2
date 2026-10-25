// Formata valores em Real: 1029.9 -> "R$ 1.029,90"
export const formatPrice = value =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

// Formata datas ISO do MongoDB: "2023-07-29T13:15:26.000Z" -> "29/07/2023"
export const formatDate = value =>
  value ? new Date(value).toLocaleDateString('pt-BR') : ''

// Data e hora: "29/07/2023 10:15"
export const formatDateTime = value =>
  value
    ? new Date(value).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    : ''

// Extrai uma mensagem legível de um erro do RTK Query / fetch
export const getErrorMessage = err =>
  err?.data?.message || err?.error || err?.message || 'Ocorreu um erro'
