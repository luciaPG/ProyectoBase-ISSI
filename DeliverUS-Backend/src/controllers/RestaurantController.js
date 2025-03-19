import { Restaurant, Product, RestaurantCategory, ProductCategory, Performance } from '../models/models.js'
// No te olvides de importar el modelo cuando añadas una tabla con include
import { Op } from 'sequelize'
const index = async function (req, res) {
  const today = new Date(Date.now())
  today.setHours(0, 0, 0, 0)
  const nextWeekLimit = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  nextWeekLimit.setHours(0, 0, 0, 0)
  try {
    const restaurants = await Restaurant.findAll({
      attributes: { exclude: ['userId'] },
      include: [ // <<<< CORRECCIÓN: Usar array para include
        {
          model: RestaurantCategory,
          as: 'restaurantCategory'
        },
        {
          model: Performance,
          as: 'performances',
          where: {
            appointment: { // <<<< Aquí está mal
              [Op.and]: [{ [Op.gte]: today }, { [Op.lt]: nextWeekLimit }]
            }
          },
          required: false
        }
      ],
      order: [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']]
    })
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const indexOwner = async function (req, res) {
  const today = new Date(Date.now())
  today.setHours(0, 0, 0, 0)
  const nextWeekLimit = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  nextWeekLimit.setHours(0, 0, 0, 0)
  try {
    const restaurants = await Restaurant.findAll({
      attributes: { exclude: ['userId'] },
      where: { userId: req.user.id },
      include: [{
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
      {
        model: Performance,
        as: 'performances',
        where: {
          appointment: { // <<<< Aquí está mal
            [Op.and]: [{ [Op.gte]: today }, { [Op.lt]: nextWeekLimit }]
          }
        },
        required: false
      }

      ]
    })
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async function (req, res) {
  const newRestaurant = Restaurant.build(req.body)
  newRestaurant.userId = req.user.id // usuario actualmente autenticado
  try {
    const restaurant = await newRestaurant.save()
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async function (req, res) {
  // Solo devuelve información pública de restaurantes
  const today = new Date(Date.now())
  today.setHours(0, 0, 0, 0)
  const nextWeekLimit = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  nextWeekLimit.setHours(0, 0, 0, 0)
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      attributes: { exclude: ['userId'] },
      include: [{
        model: Product,
        as: 'products',
        include: { model: ProductCategory, as: 'productCategory' }
      },
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      }, {
        model: Performance,
        as: 'performances',
        where: {
          appointment: {
            [Op.and]: [{ [Op.gte]: today }, { [Op.lt]: nextWeekLimit }]
          }
        },
        required: false
      }
      ],
      order: [[{ model: Product, as: 'products' }, 'order', 'ASC']]
    })
    res.json(restaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async function (req, res) {
  try {
    await Restaurant.update(req.body, { where: { id: req.params.restaurantId } })
    const updatedRestaurant = await Restaurant.findByPk(req.params.restaurantId)
    res.json(updatedRestaurant)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const result = await Restaurant.destroy({ where: { id: req.params.restaurantId } })
    let message = ''
    if (result === 1) {
      message = 'Restaurant con ID ' + req.params.restaurantId + ' eliminado exitosamente.' // Corrección de ortografía
    } else {
      message = 'No se pudo eliminar el restaurante.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const RestaurantController = {
  index,
  indexOwner,
  create,
  show,
  update,
  destroy
}
export default RestaurantController
