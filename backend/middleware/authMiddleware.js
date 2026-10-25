import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModel.js'

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.userId).select('-password')
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Não autorizado, token inválido')
    }

    // Usuário foi apagado mas o cookie ainda existe
    if (!req.user) {
      res.status(401)
      throw new Error('Não autorizado, usuário não encontrado')
    }

    next()
  } else {
    res.status(401)
    throw new Error('Não autorizado, faça login')
  }
})

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Não autorizado: apenas administradores')
  }
}

export { protect, admin }
