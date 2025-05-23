import ItemDBService from '../modules/ItemDBService.mjs'

class BrandsController {
  async getBrands(req, res) {
    try {
      const brand = 'brand'
      const getBrandList = await ItemDBService.getList(brand)
      res.json({ brands: getBrandList })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}
export default new BrandsController()
