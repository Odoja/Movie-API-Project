import { Movie } from '../schemes/movieSchema.js'

export class movieModel {
  constructor() { }

  /**
   * Fetches all movies.
   *
   * @returns {Promise<Array>} - Array of movie objects.
   */
  async getMovies() {
    const movies = await Movie.find()
      .populate('genres')
      .populate('language')

    if (!movies) {
      throw new Error('Movies not found')
    }

    return movies
  }

  /**
   * Fetches a single movie by ID.
   *
   * @param {string} id - The movie ID.
   * @returns {Promise<Object>} - Movie object.
   */
  async getMovieById(id) {
    const movie = await Movie.findById(id)
      .populate('genres')
      .populate('language')

    if (!movie) {
      throw new Error('Movie not found')
    }

    return movie
  }

  /**
   * Creates a new movie.
   * 
   * @param {string} data - Movie data.
   * @returns {Promise<Object>} - Created movie object.
   */
  async createMovie(data) {
    const movie = new Movie(data)

    await movie.save()
    await movie.populate('genres')
    await movie.populate('language')

    return movie
  }

  /**
   * Updates an existing movie.
   * 
   * @param {string} id - The movie ID.
   * @param {Object} data - The movie data to update.
   * @returns {Promise<Object>} - The updated movie object.
   */
  async updateMovie(id, data) {
    const movie = await Movie.findByIdAndUpdate(id, data, { new: true })
      .populate('genres')
      .populate('language')

    if (!movie) {
      throw new Error('Movie not found')
    }

    return movie
  }

  /**
   * Deletes a movie.
   * 
   * @param {string} id - The movie ID.
   */
  async deleteMovie(id) {
    const result = await Movie.findByIdAndDelete(id)

    if (!result) {
      throw new Error('Movie not found')
    }
  }
}
