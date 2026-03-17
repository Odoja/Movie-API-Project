import { Language } from "../schemes/languageSchema.js"

export class languageModel {
  constructor() { }

  /**
   * Fetches all languages.
   *
   * @returns {Promise<Array>} - Array of language objects.
   */
  async getLanguages() {
    const languages = await Language.find()

    if (languages.length === 0) {
      throw new Error('Languages not found')
    }

    return languages
  }

  /**
   * Fetches a single language by ID.
   *
   * @param {string} id - The language ID.
   * @returns {Promise<Object>} - Language object.
   */
  async getLanguageById(id) {
    const language = await Language.findById(id)

    if (!language) {
      throw new Error('Language not found')
    }

    return language
  }
}