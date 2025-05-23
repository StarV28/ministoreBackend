import ItemDBService from '../modules/ItemDBService.mjs'
import SearchService from '../modules/SearchService.mjs'

class SearchComponents {
  async searchByCategoryAnd(req, res) {
    try {
      const data = req.body
      const result = await SearchService.search(data)
      res.status(200).json(result)
    } catch (error) {
      console.error('Error search data', error)
      return null
    }
  }
}

export default new SearchComponents()
