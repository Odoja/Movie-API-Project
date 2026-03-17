import { GenreModel } from '../../models/database/genreModel.js'
import { formatGenre } from '../../utils/formatters.js'

const genreM = new GenreModel()

/**
 * Genrecontroller class.
 */
export class GenreController {
  /**
   * Sends a JSON response containing genres
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getGenres (req, res, next) {
    try {
      const genres = await genreM.getGenres()
      res.json(genres.map(genre => formatGenre(genre, req)))
    } catch (err) {
      next(err)
    }
  }

  /**
   * Sends a JSON response containing a genre.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getGenreById (req, res, next) {
    try {
      const genre = await genreM.getGenreById(req.params.id)
      res.json(formatGenre(genre, req))
    } catch (err) {
      next(err)
    }
  }
}
