import mongoose from 'mongoose'
import autoSeed from '../utils/autoSeed.js'

// Guarda a conexão para reaproveitar entre requisições.
// Na Vercel cada requisição pode cair numa "função" já aquecida: sem esse
// cache, cada chamada abriria uma conexão nova com o MongoDB Atlas.
let connection = null

// MONGODB_URI é o nome que a integração MongoDB Atlas da Vercel cria;
// MONGO_URI é o nome usado no .env do projeto.
const getUri = () => process.env.MONGODB_URI || process.env.MONGO_URI

// Se a string de conexão não indicar o banco (…mongodb.net/?retry…),
// usamos "lineshop" em vez do padrão "test".
const getDbName = uri => {
  try {
    const path = new URL(uri.replace('mongodb+srv://', 'https://')).pathname
    return path && path !== '/' ? undefined : process.env.DB_NAME || 'lineshop'
  } catch {
    return undefined
  }
}

const connectDB = async () => {
  if (connection) return connection

  const uri = getUri()

  connection = mongoose
    .connect(uri, { dbName: getDbName(uri || '') })
    .then(async conn => {
      console.log(`MongoDB Connected: ${conn.connection.host}`)
      try {
        await autoSeed()
      } catch (error) {
        console.log(`Aviso (seed automático): ${error.message}`)
      }
      return conn
    })
    .catch(error => {
      console.log(`Error: ${error.message}`)
      connection = null
      // No PC encerramos o servidor (como antes). Na Vercel não existe
      // "servidor" para encerrar: o erro é devolvido na requisição.
      if (!process.env.VERCEL) process.exit(1)
      throw error
    })

  return connection
}

export default connectDB
