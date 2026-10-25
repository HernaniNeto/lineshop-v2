// Monta o app Express (rotas, middlewares). Usado por:
//  - backend/server.js  → no seu PC (npm run dev / npm start)
//  - api/index.js       → na Vercel (função serverless)
import path from 'path'
import fs from 'fs'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import imageRoutes from './routes/imageRoutes.js'

// Conecta ao MongoDB assim que o app carrega
connectDB().catch(() => {})

const app = express()

// Garante a conexão com o banco antes de qualquer rota da API
// (importante na Vercel, onde a função pode "acordar" sem conexão)
app.use('/api', async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    res.status(500)
    next(new Error('Não foi possível conectar ao banco de dados'))
  }
})

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser (lê o cookie 'jwt' com o login)
app.use(cookieParser())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/images', imageRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
)

const __dirname = path.resolve()

// Imagens antigas, enviadas quando o upload salvava no disco.
// (Na Vercel elas são copiadas para o build e servidas como arquivo estático.)
const uploadsDir = path.join(__dirname, 'uploads')
if (fs.existsSync(uploadsDir)) app.use('/uploads', express.static(uploadsDir))
 
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  // set static folder
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  // any route that is not api will be redirected to index.html
  app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound)
app.use(errorHandler)

export default app
