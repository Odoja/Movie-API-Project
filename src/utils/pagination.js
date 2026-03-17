/**
 * Pagination utility class for building pagination metadata and links for API responses.
 */
export class Pagination {
  /**
   * Builds pagination metadata including total items, current page, items per page, total pages, and next/prev URLs.
   *
   * @param {number} page - Current page number (1-indexed)
   * @param {number} limit - Number of items per page
   * @param {number} total - Total number of items in the database
   * @param {object} req - Express request object (used to build pagination links)
   * @returns {object} Pagination metadata object
   */
  buildMetadata (page, limit, total, req) {
    const totalPages = Math.ceil(total / limit)
    const links = this.#buildLinks(page, limit, total, req)

    return {
      totalMovies: total,
      page,
      limit,
      totalPages,
      next_url: links.next,
      prev_url: links.prev
    }
  }

  /**
   * Builds pagination links that preserve all query parameters.
   *
   * @param {number} page - Current page number (1-indexed).
   * @param {number} limit - Items per page.
   * @param {number} total - Total number of items.
   * @param {object} req - Express request object.
   * @returns {object} - Object with next and prev URLs.
   */
  #buildLinks (page, limit, total, req) {
    const totalPages = Math.ceil(total / limit)
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`

    const params = { ...req.query }
    delete params.page

    let next = null
    if (page < totalPages) {
      next = this.#buildUrl(baseUrl, params, page + 1)
    }

    let prev = null
    if (page > 1) {
      prev = this.#buildUrl(baseUrl, params, page - 1)
    }

    return { next, prev }
  }

  /**
   * Builds a paginated URL with preserved query parameters.
   *
   * @param {string} baseUrl - The base URL (protocol + host + path)
   * @param {object} params - Query parameters to preserve
   * @param {number} page - Page number to add to URL
   * @returns {string} - Complete URL with query parameters
   */
  #buildUrl (baseUrl, params, page) {
    return `${baseUrl}?${new URLSearchParams({ ...params, page }).toString()}`
  }
}
