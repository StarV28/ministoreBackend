import pool from '../../../db/connectdb.mjs'
import bcrypt from 'bcrypt'
import { prepareToken } from '../../../utils/jwtHelpers.mjs'
import { token } from 'morgan'

class AuthUser {
  //========================================================================================================================================================

  async login(req, res) {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }
      const sql = 'SELECT * FROM users WHERE email = ?'
      const [rows] = await pool.query(sql, [email])
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }
      const user = rows[0]
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }
      const token = prepareToken({ id: user.id }, req.headers)
      res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, nickname: user.nickname },
      })
    } catch (error) {
      console.error('Error during login:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
  //========================================================================================================================================================

  async register(req, res) {
    try {
      const { email, password, nickname } = req.body
      if (!email || !password || !nickname) {
        return res.status(400).json({ error: 'Email or password are required' })
      }
      const hashedPassword = await bcrypt.hash(password, 10)

      const sql = 'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)'
      const [result] = await pool.query(sql, [email, hashedPassword, nickname])

      const token = prepareToken({ id: result.insertId }, req.headers)

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: result.insertId, nickname },
      })
    } catch (error) {
      console.error('Error during registration:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
  //========================================================================================================================================================

  async logout(req, res) {
    try {
      res.clearCookie('token')
      res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
      console.error('Error during logout:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export default new AuthUser()
