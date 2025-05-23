import ItemDBService from '../modules/ItemDBService.mjs'
import ProductService from '../modules/ProductService.mjs'
import pool from '../../../db/connectdb.mjs'

class Products {
  async FilterAndPagination(req, res) {
    try {
      const params = req.body || {}
      const result = await ProductService.getFilteredPaginationProducts(params)
      res.status(200).json({ products: result })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ error: err.message })
    }
  }

  async showCategory(req, res) {
    try {
      const category = Object.keys(req.body)[0]
      const id = req.body[category]

      const result = await ProductService.productForCarousel('products', category, id)
      if (result) {
        return res.status(200).json(result)
      }
      return res.status(200).json({ message: 'Not Find' })
    } catch (err) {
      console.error(err.message)
      res.status(500).json({ error: err.message })
    }
  }

  async getProdById(req, res) {
    try {
      const id = req.params
      const result = await ProductService.getByIdProduct(id)
      res.status(200).json(result)
    } catch (error) {
      console.error(err.message)
      res.status(500).json({ error: err.message })
    }
  }

  async rateProduct(req, res) {
    const { id, rating } = req.body
    try {
      const [rows] = await pool.query(
        'SELECT count, rating_avg, rating_sum FROM rating WHERE id_product = ?',
        [id]
      )
      let updatedRating

      if (rows.length === 0) {
        const count = 1
        const rating_sum = rating
        const rating_avg = rating
        await pool.query(
          'INSERT INTO rating (id_product, count, rating_sum, rating_avg) VALUES (?, ?, ?, ?)',
          [id, count, rating_sum, rating_avg]
        )
        await pool.query('UPDATE products SET rating = ? WHERE id_product = ?', [rating_avg, id])

        updatedRating = rating_avg
      } else {
        const old = rows[0]
        const newCount = old.count + 1
        const newSum = old.rating_sum + rating
        const newAvg = newSum / newCount

        await pool.query(
          'UPDATE rating SET count = ?, rating_sum = ?, rating_avg = ? WHERE id_product = ?',
          [newCount, newSum, newAvg, id]
        )
        await pool.query('UPDATE products SET rating = ? WHERE id_product = ?', [newAvg, id])

        updatedRating = newAvg
      }

      return res.json({
        updatedRating: updatedRating,
      })
    } catch (err) {
      console.error('Error saving rating:', err)
      res.status(500).json({ error: 'Server error' })
    }
  }
}
export default new Products()
