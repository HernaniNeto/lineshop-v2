const notFound = (req, res, next) => {
  const error = new Error(`Não encontrado - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // IDs inválidos são barrados pelo middleware checkObjectId,
  // mas tratamos aqui também por segurança (ex.: CastError do Mongoose)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Recurso não encontrado'
  }

  // Dados inválidos (campo obrigatório faltando etc.)
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Dados inválidos: verifique os campos preenchidos'
  }

  // Email (ou outro campo único) repetido
  if (err.code === 11000) {
    statusCode = 400
    message = 'Este email já está cadastrado'
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

export { notFound, errorHandler }
