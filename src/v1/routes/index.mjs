import express from 'express'
import mainRouter from './main.mjs'
import usersRouter from './user.mjs'
import authRouter from './auth.mjs'
import productRouter from './product.mjs'
import categoryRouter from './category.mjs'
import brandRouter from './brand.mjs'
import cartRouter from './cart.mjs'
import checkoutRouter from './checkout.mjs'
import searchRouter from './search.mjs'

const router = express.Router()

router.use('/', mainRouter)
router.use('/user', usersRouter)
router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/category', categoryRouter)
router.use('/brand', brandRouter)
router.use('/cart', cartRouter)
router.use('/checkout', checkoutRouter)
router.use('/search', searchRouter)

export default router
