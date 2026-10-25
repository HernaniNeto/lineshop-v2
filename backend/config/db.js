import mongoose from 'mongoose'

// Guarda a conexão para reaproveitar entre requisições.
// Na Vercel cada requisição pode cair numa "função" já aquecida: sem esse
// cache, cada chamada abriria uma conexão nova com o MongoDB Atlas.
let connection = null

const connectDB = async () => {
  if (connection) return connection

  connection = mongoose
    .connect(process.env.MONGO_URI)
    .then(conn => {
      console.log(`MongoDB Connected: ${conn.connection.host}`)
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
