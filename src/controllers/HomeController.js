/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Renders a specific view and sends the rendered HTML as a response.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  MainIndex(req, res, next) {
    res.render('Huvudsida/index') // Placeholder
  }
}
