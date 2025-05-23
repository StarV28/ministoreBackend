import ItemDBService from '../modules/ItemDBService.mjs'
import CartService from '../modules/CartService.mjs'

class CartController {
  async getItemsCart(req, res) {
    try {
      const idArr = req.body.map((item) => item.id_product)
      const result = await ItemDBService.getByIdItems('products', 'id_product', idArr)
      res.status(200).json({ products: result })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
  async getCartById(req, res) {
    try {
      const id = req.params.id
      const cart = await ItemDBService.getByID('cart', 'id_user', id)
      res.status(200).json(cart)
    } catch (error) {
      res.status(500).json({ error: err.message })
    }
  }
  async create(req, res) {
    try {
      const id_user = req.body.data.find((item) => item.id_user !== undefined)?.id_user

      const arrIdProd = req.body.data
        .filter((item) => item.id_product !== undefined && item.id_product !== null)
        .map((item) => item.id_product)

      if (!id_user || !arrIdProd.length) {
        return res.status(400).json({ message: 'Invalid data' })
      }

      const results = []
      for (const id_product of arrIdProd) {
        const data = { id_user, id_product }
        const newCart = await CartService.create('cart', data)
        if (newCart) results.push(newCart)
      }
      const insertID = results.map((r) => r.insertId)
      const products = await ItemDBService.getByIdItems('cart', 'id_cart', insertID)
      res.status(201).json({
        products,
      })
    } catch (error) {
      console.error('error create:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id
      await ItemDBService.deleteById('cart', 'id_product', id)
      res.status(200).json({ massage: 'Successful delete cart' })
    } catch (error) {
      console.error('error delete:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }
  async deleteCart(req, res) {
    try {
      const id = req.params.id
      await ItemDBService.deleteById('cart', 'id_user', id)
      res.status(200).json({ massage: 'Successful delete cart' })
    } catch (error) {
      console.error('error delete:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }
}
export default new CartController()
