import express from 'express'
import CheckoutController from '../controller/CheckoutController.mjs'

const router = express.Router()

router.post('/data', CheckoutController.createUsCheckout)

router.get('/:id', CheckoutController.checkOutList)

export default router
