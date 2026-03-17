import { generateLink } from './hateoas.js'

/**
 * Formats a movie document for API response.
 *
 * @param {object} movie - Movie document from database.
 * @param {object} req - Express request object.
 * @returns {object} - Formatted movie object.
 */
export function formatMovie (movie, req) {
  const movieId = movie._id.toString()
  return {
    id: movieId,
    releaseDate: movie.releaseDate,
    title: movie.title,
    overview: movie.overview,
    popularity: movie.popularity,
    voteCount: movie.voteCount,
    voteAverage: movie.voteAverage,
    posterUrl: movie.posterUrl,
    genres: movie.genres?.map(g => formatGenre(g, req)),
    language: formatLanguage(movie.language, req),
    _links: [
      { href: generateLink(req, 'movies', movieId), rel: 'self', method: 'GET' },
      { href: generateLink(req, 'movies'), rel: 'create', method: 'POST' },
      { href: generateLink(req, 'movies', movieId), rel: 'update', method: 'PUT' },
      { href: generateLink(req, 'movies', movieId), rel: 'delete', method: 'DELETE' }
    ]
  }
}

/**
 * Formats a genre document for API response.
 *
 * @param {object} genre - Genre document from database.
 * @param {object} req - Express request object.
 * @returns {object} - Formatted genre object.
 */
export function formatGenre (genre, req) {
  const genreId = genre._id.toString()
  return {
    id: genreId,
    name: genre.name,
    _links: [
      { href: generateLink(req, 'genres', genreId), rel: 'self', method: 'GET' }
    ]
  }
}

/**
 * Formats a language document for API response.
 *
 * @param {object} language - Language document from database.
 * @param {object} req - Express request object.
 * @returns {object} - Formatted language object.
 */
export function formatLanguage (language, req) {
  const languageId = language._id.toString()
  return {
    id: languageId,
    code: language.code,
    _links: [
      { href: generateLink(req, 'languages', languageId), rel: 'self', method: 'GET' }
    ]
  }
}
