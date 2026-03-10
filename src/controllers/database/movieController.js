import { movieModel } from "../../models/database/movieModel.js"

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
      console.log('Creating new resource', { userId: req.user.id })

      const movieData = {...req.body,owner: req.user.id}
      const movie = await movieM.createMovie(movieData)
      
      console.log(movie)

      res.status(201).json(movie)
    } catch (error) {
      console.log('Resource creation failed', { error: error.message })
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
