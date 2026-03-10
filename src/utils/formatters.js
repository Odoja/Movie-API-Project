/**
 * Formats a movie document for API response.
 *
 * @param {object} movie - Movie document from database.
 * @returns {object} - Formatted movie object.
 */
export function formatMovie(movie) {
  return {
    id: movie._id,
    releaseDate: movie.releaseDate,
    title: movie.title,
    overview: movie.overview,
    popularity: movie.popularity,
    voteCount: movie.voteCount,
    voteAverage: movie.voteAverage,
    genres: movie.genres?.map(g => g.name).join(', '),
    language: movie.language?.code,
    posterUrl: movie.posterUrl
  }
}

export function formatGenre(genre) {
  return {
    id: genre._id,
    name: genre.name
  }
}

export function formatLanguage(language) {
  return {
    id: language._id,
    code: language.code
  }
}