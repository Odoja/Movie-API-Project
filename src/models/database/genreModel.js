import { Genre } from '../schemes/genreSchema.js'

/**
 * Genremodel class.
 */
export class GenreModel {
  /**
   * Fetches all genres.
   *
   * @returns {Promise<Array>} - Array of genre objects.
   */
  async getGenres () {
    const genres = await Genre.find()

    if (genres.length === 0) {
      throw new Error('Genres not found')
    }

    return genres
  }

  /**
   * Fetches a single genre by ID.
   *
   * @param {string} id - The genre ID.
   * @returns {Promise<object>} - Genre object.
   */
  async getGenreById (id) {
    const genre = await Genre.findById(id)

    if (!genre) {
      throw new Error('Genre not found')
    }

    return genre
  }
}
