import ItemDBService from '../modules/ItemDBService.mjs'

class CategoryController {
  async getCategory(req, res) {
    try {
      const category = 'category'
      const getCategoryList = await ItemDBService.getList(category)
      res.json({ category: getCategoryList })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
export default new CategoryController()
