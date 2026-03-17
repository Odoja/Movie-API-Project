/**
 * Builds a MongoDB query object from request query parameters.
 *
 * Supports filtering movies by title with case-insensitive regex matching.
 * Can be extended to support additional filters (genre, language, year, etc.).
 *
 * @param {object} queryParams - Query parameters from the request (req.query).
 * @param {string} [queryParams.title] - Optional title filter for case-insensitive search.
 * @returns {object} - MongoDB query object. Returns empty object if no filters provided.
 */
export function titleQuery (queryParams) {
  const query = {}

  if (queryParams.title) {
    query.title = { $regex: queryParams.title, $options: 'i' }
  }

  return query
}
