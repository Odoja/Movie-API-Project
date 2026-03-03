import { Language } from "./schemes/languageSchema"

/**
 * Fetches all languages.
 *
 * @returns {Promise<Array>} - Array of language objects.
 */
export async function getLanguages() {
  const languages = await Language.find()

  return languages.map(language => ({
    id: language._id,
    code: language.code
  }))
}