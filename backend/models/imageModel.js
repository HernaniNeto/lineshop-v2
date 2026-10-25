import mongoose from 'mongoose'

// Imagens de produto enviadas pelo admin ficam guardadas no próprio MongoDB.
// Motivo: na Vercel o disco do servidor é temporário — um arquivo salvo na
// pasta uploads/ some na próxima requisição. Guardando no banco, a imagem
// fica disponível sempre, no PC e na Vercel.
const imageSchema = mongoose.Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

const Image = mongoose.model('Image', imageSchema)

export default Image
