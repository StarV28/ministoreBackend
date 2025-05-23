import ItemDBService from '../modules/ItemDBService.mjs'

class CheckoutController {
  async createUsCheckout(req, res) {
    try {
      const data = req.body.data
      const db = 'checkout'
      const nameID = 'user_id'
      const userId = String(data.user_id)

      const existingUserData = await ItemDBService.getByID(db, nameID, userId)

      let response

      if (existingUserData && existingUserData.length > 0) {
        response = await ItemDBService.update(db, nameID, userId, data)
      } else {
        response = await ItemDBService.create(db, data)
      }

      if (response) {
        return res.status(200).json(response)
      } else {
        return res.status(500).json({ message: 'Error saving item' })
      }
    } catch (error) {
      console.error('Checkout creation/update error:', error)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  async checkOutList(req, res) {
    try {
      const db = 'checkout'
      const nameID = 'user_id'
      const id = req.params.id
      const response = await ItemDBService.getByID(db, nameID, id)

      if (response) {
        return res.status(200).json(response)
      } else {
        return res.status(404).json({ message: 'User not found' })
      }
    } catch (error) {
      console.error('Checkout find error:', error)
      return res.status(500).json({ message: 'Server error' })
    }
  }
}

export default new CheckoutController()
