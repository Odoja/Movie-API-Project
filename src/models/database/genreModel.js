import { Genre } from "../schemes/genreSchema.js"
import { formatGenre } from "../../utils/formatters.js"

export class genreModel {
  constructor() { }

  /**
   * Fetches all genres.
   *
   * @returns {Promise<Array>} - Array of genre objects.
   */
  async getGenres() {
    const genres = await Genre.find()

    if (!genres) {
      throw new Error('No genres found')
    }

    return genres.map(genre => formatGenre(genre))
  }

  /**
   * Fetches a single genre by ID.
   *
   * @param {string} id - The genre ID.
   * @returns {Promise<Object>} - Genre object.
   */
  async getGenreById(id) {
    const genre = await Genre.findById(id)

    if (!genre) {
      throw new Error('Genre not found')
    }

    return formatGenre(genre)
  }
}