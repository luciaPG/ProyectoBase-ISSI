import PerformanceController from '../controllers/PerformanceController.js'
import PerformanceMiddleware from '../middlewares/PerformanceMiddleware.js'
import PerformanceValidation from '../controllers/validation/PerformanceValidation.js'
import { hasRole, isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'

const loadFileRoutes = function (app) {
  app.route('/performances')
    .post(
      isLoggedIn,
      hasRole('owner'),
      PerformanceMiddleware.checkPerformanceOwnership,
      PerformanceValidation.create,
      handleValidation,
      PerformanceController.create)
}
export default loadFileRoutes
