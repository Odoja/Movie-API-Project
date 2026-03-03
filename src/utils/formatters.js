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
    genre: movie.genreId?.name,
    language: movie.languageId?.code,
    posterUrl: movie.posterUrl
  }
}