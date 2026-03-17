
export class Pagination {
  /**
   * Builds pagination metadata for API responses, including total items, current page, total pages, and next/prev URLs.
   *
   * @param {number} page - Current page number (1-indexed).
   * @param {number} limit - Items per page.
   * @param {number} total - Total number of items.
   * @param {object} req - Express request object.
   * @return {object} - Pagination metadata object.
   */
  buildMetadata(page, limit, total, req) {
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
  #buildLinks(page, limit, total, req) {
    const totalPages = Math.ceil(total / limit)
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`

    const params = { ...req.query }
    delete params.page

    const buildUrl = (p) => {
      return `${baseUrl}?${new URLSearchParams({ ...params, page: p }).toString()}`
    }

    let next = null
    if (page < totalPages) {
      next = buildUrl(page + 1)
    }

    let prev = null
    if (page > 1) {
      prev = buildUrl(page - 1)
    }

    return { next, prev }
  }
}
