/**
 * Generates a hypermedia link from the request context.
 * Builds absolute URLs from the incoming request to ensure links work
 * across different environments (local, staging, production).
 *
 * @param {object} req - Express request object
 * @param {string} resource - Resource path (e.g. 'movies', 'genres')
 * @param {string} id - Resource ID (optional)
 * @returns {string} - Absolute URL to the resource
 */
export function generateLink (req, resource, id = null) {
  const baseUrl = `${req.protocol}://${req.get('host')}`
  return id ? `${baseUrl}/${resource}/${id}` : `${baseUrl}/${resource}`
}
