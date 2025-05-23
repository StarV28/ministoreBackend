import pool from '../../../db/connectdb.mjs'

class ProductService {
  static async productForCarousel(db, nameID, id) {
    try {
      const sql = `SELECT * FROM \`${db}\` WHERE \`${nameID}\` = ? LIMIT 5`
      const [rows] = await pool.query(sql, [id])
      return rows || null
    } catch (error) {
      console.error('Error fetching data by ID:', error)
      return null
    }
  }
  //=======GetList Pagination and FilterProducts=================================================================================================================================================
  static async getFilteredPaginationProducts({ params }) {
    const { category, brand, minPrice = 0, maxPrice, limit = 6, page = 1 } = params
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM products WHERE 1=1'
    let countQuery = 'SELECT COUNT(*) AS total FROM products WHERE 1=1'
    const queryParams = []
    const countParams = []

    if (Array.isArray(category) && category.length) {
      const placeholders = category.map(() => '?').join(',')
      query += ` AND id_category IN (${placeholders})`
      countQuery += ` AND id_category IN (${placeholders})`
      queryParams.push(...category)
      countParams.push(...category)
    }

    if (Array.isArray(brand) && brand.length) {
      const placeholders = brand.map(() => '?').join(',')
      query += ` AND id_brand IN (${placeholders})`
      countQuery += ` AND id_brand IN (${placeholders})`
      queryParams.push(...brand)
      countParams.push(...brand)
    }
    if (minPrice != null && maxPrice != null) {
      query += ' AND price BETWEEN ? AND ?'
      countQuery += ' AND price BETWEEN ? AND ?'
      queryParams.push(minPrice, maxPrice)
      countParams.push(minPrice, maxPrice)
    }
    query += ' LIMIT ? OFFSET ?'
    queryParams.push(Number(limit), Number(offset))

    const [rows] = await pool.execute(query, queryParams)
    const [countRows] = await pool.execute(countQuery, countParams)

    return {
      products: rows,
      total: countRows[0].total,
    }
  }
  //====find PRODUCT  by ID====================================================================================================================================================
  static async getByIdProduct({ id }) {
    try {
      const sql = `SELECT *, c.title AS category_title FROM products AS p JOIN category AS c ON p.id_category = c.id_category WHERE p.id_product = ? LIMIT 1;`

      const [rows] = await pool.query(sql, [id])
      return rows[0] || null
    } catch (error) {
      console.error('Error fetching data by ID:', error)
      return null
    }
  }
}

export default ProductService
