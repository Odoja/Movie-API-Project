import { movieModel } from "../models/movieModel.js"

const movieM = new movieModel()

export class movieController {

  async getMovies(req, res, next) {
    try {
      const movies = await movieM.getMovies()
      res.json(movies)
    } catch (err) {
      next(err)
    }
  }

  async getMovieById(req, res, next) {
    try {
      const movie = await movieM.getMovieById(req.params.id)
      res.json(movie)
    } catch (err) {
      next(err)
    }
  }

  async createMovie(req, res, next) {
    try {
      const movie = await movieM.createMovie(req.body)
      res.status(201).json(movie)
    } catch (error) {
      next(error)
    }
  }

  async updateMovie(req, res, next) {
    try {
      const movie = await movieM.updateMovie(req.params.id, req.body)
      res.json(movie)
    } catch (error) {
      next(error)
    }
  }

  async deleteMovie(req, res, next) {
    try {
      await movieM.deleteMovie(req.params.id)
      res.status(200).end()
    } catch (error) {
      next(error)
    }
  }
}
