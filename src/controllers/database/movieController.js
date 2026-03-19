import { MovieModel } from '../../models/database/movieModel.js'
import { formatMovie } from '../../utils/formatters.js'
import { Pagination } from '../../utils/pagination.js'
import { titleQuery } from '../../utils/filtering.js'

const movieM = new MovieModel()
const pagination = new Pagination()

/**
 * Moviecontroller class.
 */
export class MovieController {
  /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the resource to load.
   */
  async loadMovie (req, res, next, id) {
    try {
      const movie = await movieM.getMovieById(id)
      req.doc = movie
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing movies with pagination and filtering.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getMovies (req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = 20
      const skip = (page - 1) * limit

      const query = titleQuery(req.query)

      const result = await movieM.getMovies(skip, limit, query)

      const metaData = pagination.buildMetadata(page, limit, result.total, req)

      res.json({
        movies: result.movies.map(movie => formatMovie(movie, req)),
        metaData
      })
    } catch (err) {
      next(err)
    }
  }

  /**
   * Sends a JSON response containing a movie.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getMovieById (req, res, next) {
    try {
      const movie = await movieM.getMovieById(req.params.id)
      res.json(formatMovie(movie, req))
    } catch (err) {
      next(err)
    }
  }

  /**
   * Creates a new movie.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createMovie (req, res, next) {
    try {
      const movieData = { ...req.body, owner: req.user.id }
      const movie = await movieM.createMovie(movieData)

      res.status(201).json(formatMovie(movie, req))
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a specific movie.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updateMovie (req, res, next) {
    try {
      const allowedFields = ['title', 'releaseDate', 'overview', 'genres', 'language', 'posterUrl']

      // Filter only allowed fields from request body
      const updateData = {}
      for (const field of allowedFields) {
        if (field in req.body) {
          updateData[field] = req.body[field]
        }
      }

      await movieM.updateMovie(req.params.id, updateData)

      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes the specified movie.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteMovie (req, res, next) {
    try {
      await movieM.deleteMovie(req.params.id)
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}
