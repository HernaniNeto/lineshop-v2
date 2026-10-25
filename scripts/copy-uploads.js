// Copia as imagens antigas da pasta uploads/ para dentro do build do React,
// para que os links /uploads/... continuem funcionando na Vercel.
import fs from 'fs'
import path from 'path'

const src = path.resolve('uploads')
const dest = path.resolve('frontend', 'build', 'uploads')

if (fs.existsSync(src)) {
  fs.cpSync(src, dest, { recursive: true })
  console.log(`Imagens copiadas: ${fs.readdirSync(dest).length}`)
} else {
  console.log('Pasta uploads/ não encontrada — nada para copiar')
}
