import express from 'express'
import UserController from '../controller/UserController.mjs'

const router = express.Router()

router.get('/:id', UserController.getUserById)

router.post('/', UserController.updateUser)

router.post('/forgot', UserController.getUserByEmail)

router.post('/enter', UserController.checkCode)

router.delete('/:id', UserController.deleteUser)

export default router
