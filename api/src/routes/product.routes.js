import { Router } from 'express'
import * as productCtrl from '../controllers/product.controller.js'
import { authRequired, requireRole } from '../middlewares/auth.js'
import { uploadImage } from '../middlewares/upload.js'

const router = Router()

router.get('/', productCtrl.list)
router.get('/:id', productCtrl.getById)
router.get('/:id/image', productCtrl.image)

router.post('/', authRequired, requireRole('ADMIN'), uploadImage, productCtrl.create)
router.put('/:id', authRequired, requireRole('ADMIN'), uploadImage, productCtrl.update)
router.delete('/:id', authRequired, requireRole('ADMIN'), productCtrl.remove)

export default router
