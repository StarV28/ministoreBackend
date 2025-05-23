import pool from '../../../db/connectdb.mjs'

class SearchService {
  static async search(data) {
    try {
      let sql
      let values = []

      const hasCategories = Array.isArray(data.id_category) && data.id_category.length > 0

      if (hasCategories) {
        const placeholders = data.id_category.map(() => '?').join(', ')
        sql = `
        SELECT * FROM products
        WHERE id_category IN (${placeholders})
          AND MATCH(title, description_en, description_ua, description_de)
          AGAINST(? IN BOOLEAN MODE)
      `
        values = [...data.id_category, data.search]
      } else {
        sql = `
        SELECT * FROM products
        WHERE MATCH(title, description_en, description_ua, description_de)
          AGAINST(? IN BOOLEAN MODE)
      `
        values = [data.search]
      }

      const [rows] = await pool.execute(sql, values)
      return rows
    } catch (error) {
      console.error('Search error:', error)
      throw error
    }
  }
}
export default SearchService
