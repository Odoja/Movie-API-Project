import { Movie } from './movieSchema.js'
import { formatMovie } from '../utils/formatters.js'

/**
 * Fetches all movies with populated genre and language data.
 *
 * @returns {Promise<Array>} - Array of formatted movie objects.
 */
export async function getMovies() {
  const movies = await Movie.find()
  .populate('genreId')
  .populate('languageId')

  if (!movies) {
    throw new Error('No movies found')
  }

  return movies.map(movie => formatMovie(movie))
}

/**
 * Fetches a single movie by ID.
 *
 * @param {string} id - Movie ID.
 * @returns {Promise<object>} - Formatted movie object.
 */
export async function getMovieById(id) {
  const movie = await Movie.findById(id)
  .populate('genreId')
  .populate('languageId')

  if (!movie) {
    throw new Error('Movie not found')
  }

  return formatMovie(movie)
}

/**
 * Creates a new movie.
 *
 * @param {object} data - Movie data.
 * @returns {Promise<object>} - Created movie object.
 */
export async function createMovie(data) {
  const movie = new Movie({
    releaseDate: data.releaseDate,
    title: data.title,
    overview: data.overview,
    popularity: data.popularity,
    voteCount: data.voteCount,
    voteAverage: data.voteAverage,
    genreId: data.genreId,
    languageId: data.languageId,
    posterUrl: data.posterUrl
  })

  await movie.save()
  await movie.populate('genreId').populate('languageId')

  return formatMovie(movie)
}

/**
 * Updates an existing movie.
 *
 * @param {string} id - Movie ID.
 * @param {object} data - Updated movie data.
 * @returns {Promise<object>} - Updated movie object.
 */
export async function updateMovie(id, data) {
  const movie = await Movie.findByIdAndUpdate(id, data, { new: true })
  .populate('genreId')
  .populate('languageId')

  if (!movie) {
    throw new Error('Movie not found')
  }

  return formatMovie(movie)
}

/**
 * Deletes a movie by ID.
 *
 * @param {string} id - Movie ID.
 * @returns {Promise<void>}
 */
export async function deleteMovie(id) {
  const result = await Movie.findByIdAndDelete(id)

  if (!result) {
    throw new Error('Movie not found')
  }
}

