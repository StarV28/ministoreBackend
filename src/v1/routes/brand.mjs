import express from 'express'
import BrandController from '../controller/BrandController.mjs'

const router = express.Router()

router.get('/', BrandController.getBrands)

export default router
