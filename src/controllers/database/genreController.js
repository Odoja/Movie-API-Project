import { genreModel } from '../../models/database/genreModel.js'
import { formatGenre } from "../../utils/formatters.js"

const genreM = new genreModel()

export class genreController {
  async getGenres(req, res, next) {
    try {
      const genres = await genreM.getGenres()
      res.json(genres.map(genre => formatGenre(genre, req)))
    } catch (err) {
      next(err)
    }
  }

  async getGenreById(req, res, next) {
    try {
      const genre = await genreM.getGenreById(req.params.id)
      res.json(formatGenre(genre, req))
    } catch (err) {
      next(err)
    }
  }
}
