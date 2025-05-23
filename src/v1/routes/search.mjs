import express from 'express'
import SearchController from '../controller/SearchController.mjs'

const router = express.Router()

router.post('/', SearchController.searchByCategoryAnd)

export default router
