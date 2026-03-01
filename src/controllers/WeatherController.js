import { getCurrentWeather, getForecast, searchCityByName } from '../models/weatherModel.js'

/**
 * Encapsulates a controller.
 */
export class WeatherController {
  /**
   * Renders a specific view and sends the rendered HTML as a response.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  WeatherIndex (req, res, next) {
    res.render('Weather/timeAndweather') //Placeholder
  }

  /**
   * Handles a request to fetch current weather data for a given location.
   * Expects query parameters: lat, lon, and optionally name.
   * Responds with JSON containing weather data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getWeather (req, res, next) {
    try {
      const { lat, lon, name } = req.query
      const data = await getCurrentWeather({ lat, lon, name })
      res.json(data)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Handles a request to fetch 5-day weather forecast data for a given location.
   * Expects query parameters: lat, lon, and optionally name.
   * Responds with JSON containing forecast data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getFiveDayForecast (req, res, next) {
    try {
      const { lat, lon, name } = req.query
      const data = await getForecast({ lat, lon, name })
      res.json(data)
    } catch (err) {
      next(err)
    }
  }
}