import { isValidObjectId } from 'mongoose'

// Garante que o :id da URL é um ObjectId válido do MongoDB.
// Sem isso, um ID mal formatado (ex.: /api/products/abc) gerava erro 500
// ("CastError") em vez de uma resposta 404 clara.
function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404)
    throw new Error(`ID inválido: ${req.params.id}`)
  }
  next()
}

export default checkObjectId
