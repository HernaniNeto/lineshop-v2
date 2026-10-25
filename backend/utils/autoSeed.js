import mongoose from 'mongoose'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import products from '../data/products.js'

// Trava simples para que duas instâncias da Vercel não semeiem ao mesmo tempo
const seedLockSchema = new mongoose.Schema({ _id: String, at: Date })
const SeedLock =
  mongoose.models.SeedLock || mongoose.model('SeedLock', seedLockSchema)

// Quando o banco está vazio (ex.: banco novo na Vercel), cria o administrador
// e os produtos de exemplo automaticamente.
// O admin usa ADMIN_EMAIL e ADMIN_PASSWORD das variáveis de ambiente — nunca
// a senha de exemplo "123456", porque a loja fica pública na internet.
const autoSeed = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, SKIP_AUTO_SEED } = process.env

  if (SKIP_AUTO_SEED) return

  if ((await Product.countDocuments()) > 0) return

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log(
      'Banco vazio: defina ADMIN_EMAIL e ADMIN_PASSWORD para criar o admin e os produtos de exemplo.'
    )
    return
  }

  try {
    await SeedLock.create({ _id: 'initial-seed', at: new Date() })
  } catch (error) {
    return // outra instância já está semeando (ou já semeou)
  }

  let admin = await User.findOne({ email: ADMIN_EMAIL })
  if (!admin) {
    admin = await User.create({
      name: ADMIN_NAME || 'Administrador',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // criptografada pelo userModel
      isAdmin: true
    })
  }

  await Product.insertMany(products.map(p => ({ ...p, user: admin._id })))
  console.log(`Banco semeado: admin ${ADMIN_EMAIL} e ${products.length} produtos`)
}

export default autoSeed
