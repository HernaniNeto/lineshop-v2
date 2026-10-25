import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// Busca por email sem diferenciar maiúsculas/minúsculas
const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const findByEmail = email =>
  User.findOne({
    email: { $regex: `^${escapeRegex(String(email || '').trim())}$`, $options: 'i' }
  })

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Informe email e senha')
  }

  const user = await findByEmail(email)

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(401)
    throw new Error('Email ou senha inválidos')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim()
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')

  // CORREÇÃO: antes, campos vazios geravam um erro técnico em inglês
  // ("User validation failed...") com status 500
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Preencha nome, email e senha')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400)
    throw new Error('Email inválido')
  }
  if (password.length < 6) {
    res.status(400)
    throw new Error('A senha precisa ter pelo menos 6 caracteres')
  }

  const userExists = await findByEmail(email)

  if (userExists) {
    res.status(400)
    throw new Error('Este email já está cadastrado')
  }

  const user = await User.create({
    name,
    email,
    password
  })

  if (user) {
    generateToken(res, user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(400)
    throw new Error('Dados de usuário inválidos')
  }
})

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: 'Logout realizado com sucesso' })
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  } else {
    res.status(404)
    throw new Error('Usuário não encontrado')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  } else {
    res.status(404)
    throw new Error('Usuário não encontrado')
  }
})

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
})


// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404)
    throw new Error('Usuário não encontrado')
  }
})


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Não é possível apagar um administrador')
    }
    await User.deleteOne({_id: user._id})
    res.status(200).json({ message: 'Usuário apagado com sucesso' })
  } else {
    // CORREÇÃO: faltava o status 404 (respondia 500)
    res.status(404)
    throw new Error('Usuário não encontrado')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    // Mantém o valor atual se o campo não for enviado
    if (req.body.isAdmin !== undefined) {
      user.isAdmin = Boolean(req.body.isAdmin)
    }

    const updatedUser = await user.save()

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('Usuário não encontrado')
  }
})

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
}
