import { Genre } from "./schemes/genreSchema.js"

/**
 * Fetches all genres.
 *
 * @returns {Promise<Array>} - Array of genre objects.
 */
export async function getGenres() {
  const genres = await Genre.find()

  return genres.map(genre => ({
    id: genre._id,
    name: genre.name
  }))
}