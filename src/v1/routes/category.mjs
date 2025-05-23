import express from 'express'
import CategoryController from '../controller/CategoryController.mjs'

const router = express.Router()

router.get('/', CategoryController.getCategory)

export default router
