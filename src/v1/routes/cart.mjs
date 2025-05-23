import express from 'express'
import CartController from '../controller/CartController.mjs'

const router = express.Router()

router.post('/products', CartController.getItemsCart)

router.get('/:id', CartController.getCartById)

router.post('/create', CartController.create)

router.delete('/delete/:id', CartController.delete)

router.delete('/delete-cart/:id', CartController.deleteCart)

export default router
