import { languageModel } from '../../models/database/languageModel.js'

const languageM = new languageModel()

export class languageController {
  async getLanguages(req, res, next) {
    try {
      const languages = await languageM.getLanguages()
      res.json(languages)
    } catch (err) {
      next(err)
    }
  }

  async getLanguageById(req, res, next) {
    try {
      const language = await languageM.getLanguageById(req.params.id)
      res.json(language)
    } catch (err) {
      next(err)
    }
  }
}
