import { LanguageModel } from '../../models/database/languageModel.js'
import { formatLanguage } from '../../utils/formatters.js'

const languageM = new LanguageModel()

/**
 * LanguageController class.
 */
export class LanguageController {
  /**
   * Sends a JSON response containing languages.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getLanguages (req, res, next) {
    try {
      const languages = await languageM.getLanguages()
      res.json(languages.map(language => formatLanguage(language, req)))
    } catch (err) {
      next(err)
    }
  }

  /**
   * Sends a JSON response containing a language.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getLanguageById (req, res, next) {
    try {
      const language = await languageM.getLanguageById(req.params.id)
      res.json(formatLanguage(language, req))
    } catch (err) {
      next(err)
    }
  }
}
