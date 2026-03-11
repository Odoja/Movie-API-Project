import { movieModel } from "../../models/database/movieModel.js"
import { formatMovie } from '../../utils/formatters.js'

const movieM = new movieModel()

export class movieController {

  /**
   * Provide req.doc to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the resource to load.
   */
  async loadMovie(req, res, next, id) {
    try {
      const movie = await movieM.getMovieById(id)
      req.doc = movie
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing all movies.
   *
   * Public, no ownership check is performed.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getMovies(req, res, next) {
    try {
      const movies = await movieM.getMovies()
      res.json(movies.map(movie => formatMovie(movie)))
    } catch (err) {
      next(err)
    }
  }

  /**
   * Sends a JSON response containing a movie.
   *
   * Public, no ownership check is performed.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getMovieById(req, res, next) {
    try {
      const movie = await movieM.getMovieById(req.params.id)
      res.json(formatMovie(movie))
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
  async createMovie(req, res, next) {
    try {
      const movieData = { ...req.body, owner: req.user.id }
      const movie = await movieM.createMovie(movieData)

      res.status(201).json(formatMovie(movie))
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
  async updateMovie(req, res, next) {
    try {
      const allowedFields = ['title', 'releaseDate', 'overview', 'genres', 'language', 'posterUrl']

      // Only update fields that are provided in the request
      for (const field of allowedFields) {
        if (field in req.body) {
          req.doc[field] = req.body[field]
        }
      }

      if (req.doc.isModified()) {
        await req.doc.validate()
        await req.doc.save()
      }

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
  async deleteMovie(req, res, next) {
    try {
      await movieM.deleteMovie(req.params.id)
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}
