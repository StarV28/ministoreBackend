import express from 'express'
import ProductsController from '../controller/ProductsController.mjs'

const router = express.Router()

router.post('/', ProductsController.FilterAndPagination)

router.get('/:id', ProductsController.getProdById)

router.post('/rating', ProductsController.rateProduct)

router.post('/category', ProductsController.showCategory)

export default router
