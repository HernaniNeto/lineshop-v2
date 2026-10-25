import mongoose from 'mongoose'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import products from '../data/products.js'

// Trava simples para que duas instâncias da Vercel não façam a mesma tarefa ao mesmo tempo
const seedLockSchema = new mongoose.Schema({ _id: String, at: Date })
const SeedLock =
  mongoose.models.SeedLock || mongoose.model('SeedLock', seedLockSchema)

const CATALOG_LOCK = 'catalog-linerock-v1'

// Produtos de exemplo do curso que existiam antes do catálogo da Linerock
const OLD_SAMPLE_NAMES = [
  'Airpods Wireless Bluetooth Headphones',
  'iPhone 11 Pro 256GB Memory',
  'Cannon EOS 80D DSLR Camera',
  'Sony Playstation 4 Pro White Version',
  'Logitech G-Series Gaming Mouse',
  'Amazon Echo Dot 3rd Generation'
]

const acquireLock = async id => {
  try {
    await SeedLock.create({ _id: id, at: new Date() })
    return true
  } catch (error) {
    return false // já feito (ou outra instância está fazendo agora)
  }
}

// Banco vazio (ex.: banco novo na Vercel): cria o administrador e o catálogo.
// O admin usa ADMIN_EMAIL e ADMIN_PASSWORD das variáveis de ambiente — nunca
// a senha de exemplo "123456", porque a loja fica pública na internet.
const seedEmptyDatabase = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log(
      'Banco vazio: defina ADMIN_EMAIL e ADMIN_PASSWORD para criar o admin e os produtos.'
    )
    return
  }

  if (!(await acquireLock('initial-seed'))) return

  let admin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() })
  if (!admin) {
    admin = await User.create({
      name: ADMIN_NAME || 'Administrador',
      email: ADMIN_EMAIL.toLowerCase(),
      password: ADMIN_PASSWORD, // criptografada pelo userModel
      isAdmin: true
    })
  }

  await Product.insertMany(products.map(p => ({ ...p, user: admin._id })))
  await acquireLock(CATALOG_LOCK) // o catálogo já entrou completo
  console.log(`Banco semeado: admin ${ADMIN_EMAIL} e ${products.length} produtos`)
}

// Banco que já tinha os produtos de exemplo: troca pelo catálogo da Linerock.
// Roda UMA vez só (por causa da trava) — se depois o admin apagar ou editar
// um produto pelo painel, isso não é desfeito.
const migrateCatalog = async () => {
  if (await SeedLock.exists({ _id: CATALOG_LOCK })) return

  const admin = await User.findOne({ isAdmin: true })
  if (!admin) return

  if (!(await acquireLock(CATALOG_LOCK))) return

  const removed = await Product.deleteMany({ name: { $in: OLD_SAMPLE_NAMES } })

  const existing = await Product.find({
    name: { $in: products.map(p => p.name) }
  })
  const existingNames = existing.map(p => p.name)
  const toInsert = products
    .filter(p => !existingNames.includes(p.name))
    .map(p => ({ ...p, user: admin._id }))

  if (toInsert.length) await Product.insertMany(toInsert)

  console.log(
    `Catálogo Linerock: ${toInsert.length} produtos adicionados, ${removed.deletedCount || 0} exemplos removidos`
  )
}

const autoSeed = async () => {
  if (process.env.SKIP_AUTO_SEED) return

  if ((await Product.countDocuments()) === 0) {
    await seedEmptyDatabase()
  } else {
    await migrateCatalog()
  }
}

export default autoSeed
