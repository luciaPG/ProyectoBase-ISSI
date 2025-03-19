import { check } from 'express-validator'
import { Performance, Restaurant } from '../../models/models.js'
import { Op } from 'sequelize'

const checkRestaurantExists = async (value, { req }) => {
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (!restaurant) {
      return Promise.reject(new Error('The restaurantId does not exist.'))
    }
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}

const checkAppointmentValidDate = async (value, { req }) => {
  try {
    const performances = await Performance.findAll({
      where: { restaurantId: req.body.restaurantId }
    })

    const newPerformanceDate = new Date(value)
    newPerformanceDate.setHours(0, 0, 0, 0)

    for (const performance of performances) {
      const performanceDateToCompare = new Date(performance.appointment)
      performanceDateToCompare.setHours(0, 0, 0, 0)

      if (newPerformanceDate.getTime() === performanceDateToCompare.getTime()) {
        return Promise.reject(new Error('No pueden haber dos actuaciones en el mismo día.'))
      }
    }

    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}

export const create = [
  check('group').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('appointment').exists().toDate(),
  check('restaurantId').exists().isInt({ min: 1 }).toInt(),
  check('restaurantId').custom(checkRestaurantExists),
  check('appointment').custom(checkAppointmentValidDate)
]

export default { create }
