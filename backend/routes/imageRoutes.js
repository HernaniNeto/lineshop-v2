import express from 'express'
import asyncHandler from '../middleware/asyncHandler.js'
import checkObjectId from '../middleware/checkObjectId.js'
import Image from '../models/imageModel.js'

const router = express.Router()

// @desc    Mostra uma imagem guardada no banco
// @route   GET /api/images/:id
// @access  Public
router.get(
  '/:id',
  checkObjectId,
  asyncHandler(async (req, res) => {
    const image = await Image.findById(req.params.id)

    if (!image) {
      res.status(404)
      throw new Error('Imagem não encontrada')
    }

    res.set('Content-Type', image.contentType)
    // A imagem nunca muda (cada upload gera um ID novo): pode ficar em cache
    res.set('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(image.data)
  })
)

export default router
