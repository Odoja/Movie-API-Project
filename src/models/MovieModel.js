import { Movie } from './schemes/movieSchema.js'
import { formatMovie } from '../utils/formatters.js'

export class movieModel {
  constructor() { }

  async getMovies() {
    const movies = await Movie.find()
      .populate('genre')
      .populate('language')

    if (!movies) {
      throw new Error('No movies found')
    }

    return movies.map(movie => formatMovie(movie))
  }

  async getMovieById(id) {
    const movie = await Movie.findById(id)
      .populate('genre')
      .populate('language')

    if (!movie) {
      throw new Error('Movie not found')
    }

    return formatMovie(movie)
  }

  async createMovie(data) {
    const movie = new Movie(data)

    await movie.save()
    await movie.populate('genre')
    await movie.populate('language')

    return formatMovie(movie)
  }

  async updateMovie(id, data) {
    const movie = await Movie.findByIdAndUpdate(id, data, { new: true })
      .populate('genre')
      .populate('language')

    if (!movie) {
      throw new Error('Movie not found')
    }

    return formatMovie(movie)
  }

  async deleteMovie(id) {
    const result = await Movie.findByIdAndDelete(id)

    if (!result) {
      throw new Error('Movie not found')
    }
  }
}
