import pool from '../../../db/connectdb.mjs'

class UserService {
  static async getByEmail(data) {
    try {
      const sql = `SELECT * FROM users WHERE email=?`
      const [row] = await pool.query(sql, [data])
      return row[0] || null
    } catch (error) {
      console.error('Error find email', error)
    }
  }
}

export default UserService
