import { genreModel } from '../models/genreModel.js'

const genreM = new genreModel()

export class genreController {
  async getGenres(req, res, next) {
    try {
      const genres = await genreM.getGenres()
      res.json(genres)
    } catch (err) {
      next(err)
    }
  }

  async getGenreById(req, res, next) {
    try {
      const genre = await genreM.getGenreById(req.params.id)
      res.json(genre)
    } catch (err) {
      next(err)
    }
  }
}
