import path from 'path'
import express from 'express'
import multer from 'multer'
import { protect, admin } from '../middleware/authMiddleware.js'
import Image from '../models/imageModel.js'

const router = express.Router()

// O arquivo fica na memória e depois é salvo no MongoDB (veja models/imageModel.js).
// Limite de 4 MB: a Vercel recusa requisições maiores que 4,5 MB.
const MAX_SIZE = 4 * 1024 * 1024

// Aceita apenas imagens JPG/JPEG/PNG/WEBP
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = mimetypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Apenas imagens (jpg, jpeg, png ou webp)!'), false)
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
})
const uploadSingleImage = upload.single('image')

// Só administradores podem enviar imagens
router.post('/', protect, admin, (req, res, next) => {
  uploadSingleImage(req, res, async function (err) {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'Imagem muito grande (máximo 4 MB)'
          : err.message
      return res.status(400).send({ message })
    }

    if (!req.file) {
      return res.status(400).send({ message: 'Nenhum arquivo enviado' })
    }

    try {
      const image = await Image.create({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
        size: req.file.size,
        user: req.user._id
      })

      res.status(200).send({
        message: 'Imagem carregada com sucesso!',
        image: `/api/images/${image._id}`
      })
    } catch (error) {
      next(error)
    }
  })
})

export default router
