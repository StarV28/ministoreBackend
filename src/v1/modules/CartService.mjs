import pool from '../../../db/connectdb.mjs'

class CartService {
  static async create(db, data) {
    try {
      const checkSql = `SELECT * FROM \`${db}\` WHERE id_product = ? AND id_user = ?`
      const [existing] = await pool.query(checkSql, [data.id_product, data.id_user])
      console.log('data.id_product', data.id_product)
      if (existing.length > 0) {
        console.log('Product already in cart for this user.')
        return { message: 'Already exists', existing: existing[0] }
      }

      const insertSql = `INSERT INTO \`${db}\` SET ?`
      const [result] = await pool.query(insertSql, data)
      return result
    } catch (error) {
      console.error('Error saving data:', error)
      return null
    }
  }
}

export default CartService
