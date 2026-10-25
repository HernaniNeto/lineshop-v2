// Ponto de entrada da API na Vercel.
// A Vercel transforma este arquivo numa função serverless: toda chamada a
// /api/... é redirecionada para cá (veja vercel.json) e tratada pelo mesmo
// app Express que roda no seu PC.
import app from '../backend/app.js'

export default app
