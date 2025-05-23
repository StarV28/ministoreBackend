import pool from '../../../db/connectdb.mjs'

class ItemDBService {
  //===read all users=====================================================================================================================================================

  static async getList(db) {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${db}`)
      return rows
    } catch (error) {
      console.error('Error fetching data:', error)
      return []
    }
  }

  //=====create users===================================================================================================================================================

  static async create(db, data) {
    try {
      const sql = `INSERT INTO \`${db}\`  SET ?`
      const [result] = await pool.query(sql, data)
      return { id: result.insertId, ...data }
    } catch (error) {
      console.error('Error saving data:', error)
      return null
    }
  }
  //========================================================================================================================================================
  static async getByIdItems(db, idName, data) {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        console.error('getByIdItems: Array is empty ID:', data)
        return []
      }
      const placeholders = data.map(() => '?').join(', ')
      const sql = `SELECT * FROM \`${db}\` WHERE \`${idName}\` IN (${placeholders})`
      const [rows] = await pool.execute(sql, data)
      return rows || null
    } catch (error) {
      console.error('Error fetching data by ID:', error)
      return null
    }
  }

  //===========find item by ID=============================================================================================================================================
  static async getByID(db, nameID, id) {
    try {
      const sql = `SELECT * FROM \`${db}\` WHERE \`${nameID}\` = ?`
      const [rows] = await pool.query(sql, [id])
      return rows || null
    } catch (error) {
      console.error('Error fetching data by ID:', error)
      return null
    }
  }
  //===update user by ID================================================================================================================================================

  static async update(db, nameID, id, data) {
    try {
      const sql = `UPDATE \`${db}\` SET ? WHERE \`${nameID}\` = ?`
      const [result] = await pool.query(sql, [data, id])

      if (result.affectedRows === 0) {
        return null
      }

      return { id, ...data }
    } catch (error) {
      console.error('Error updating data:', error)
      return null
    }
  }

  //===delete user by ID================================================================================================================================================
  static async deleteById(db, idName, id) {
    try {
      const sql = `DELETE FROM \`${db}\`  WHERE \`${idName}\`= ?`
      const [result] = await pool.query(sql, id)
      if (result.affectedRows === 0) {
        return null
      }
      return { id }
    } catch (error) {
      console.error('Error deleting data:', error)
      return null
    }
  }
}

export default ItemDBService
