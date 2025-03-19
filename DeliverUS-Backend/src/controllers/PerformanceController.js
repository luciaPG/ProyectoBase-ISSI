import { Performance } from '../models/models.js'
const create = async function (req, res) {
  const performance = Performance.build(req.body)
  try {
    await performance.save()
    res.json(performance)
  } catch (err) {
    res.status(500).send(err)
  }
}
const ProductCategoryController = {
  create
}
export default ProductCategoryController
