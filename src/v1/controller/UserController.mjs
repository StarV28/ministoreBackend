import ItemDBService from '../modules/ItemDBService.mjs'
import UserService from '../modules/UserService.mjs'
import redisClient from '../../../db/configRedis.mjs'
import bcrypt from 'bcrypt'
import { prepareTokenEmailForgot, parseBearer, prepareToken } from '../../../utils/jwtHelpers.mjs'
import { sendCodeToEmail } from '../../../utils/mailService.js'

class UserController {
  //========================================================================================================================================================

  async getUserById(req, res) {
    try {
      const id = req.params.id
      const user = await ItemDBService.getByID('users', 'id', id)
      res.status(200).json(user[0])
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
  //========================================================================================================================================================

  async updateUser(req, res) {
    try {
      const id = req.body.data.id
      let data = { ...req.body.data }

      const pass = data.password

      if (pass) {
        const hashedPassword = await bcrypt.hash(pass, 10)
        data.password = hashedPassword
      } else {
        delete data.password
      }

      const response = await ItemDBService.update('users', 'id', id, data)
      res.status(200).json(response)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  //========================================================================================================================================================

  async getUserByEmail(req, res) {
    try {
      const email = req.body.emailSab
      const response = await UserService.getByEmail(email)

      if (!response) {
        return res.status(404).json({ error: 'Email not found' })
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const tokenCode = prepareTokenEmailForgot({ email: email }, req.headers)

      const codeBc = await bcrypt.hash(code, 10)

      const sent = await sendCodeToEmail(email, code)

      if (sent) {
        //--------Redis + TTL----------//
        await redisClient.set(`verify:${email}`, codeBc, { EX: 180 })

        return res.status(200).json({ success: true, tokenCode })
      } else {
        return res.status(500).json({ error: 'Failed to send email' })
      }
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
  //========================================================================================================================================================
  async checkCode(req, res) {
    try {
      const { code, token } = req.body

      const emailToken = parseBearer(token, req.headers)

      const savedCode = await redisClient.get(`verify:${emailToken.email}`)

      if (!savedCode) {
        return res.status(400).json({ error: 'Code expired or not found' })
      }

      const isMatch = await bcrypt.compare(code, savedCode)

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid code' })
      }

      await redisClient.del(`verify:${emailToken.email}`)

      const user = await UserService.getByEmail(emailToken.email)
      if (!user) return res.status(404).json({ error: 'User not found' })

      const accessToken = prepareToken({ id: user.id, email: user.email }, req.headers)

      return res.status(200).json({
        message: 'Code verified',
        accessToken,
        user: {
          id: user.id,
        },
      })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  //========================================================================================================================================================

  async deleteUser(req, res) {
    try {
      const id = req.params.id
      const response = await ItemDBService.deleteById('users', 'id', id)

      if (response) {
        res.status(200).json({ message: 'User deleted successfully', id: response.id })
      } else {
        res.status(404).json({ message: 'User not found or deletion failed' })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ message: 'Error deleting user' })
    }
  }
}
export default new UserController()
