/**
 * Fetches current weather data for a given city using the OpenWeather API.
 *
 * @param {object} city - The city object containing location information.
 * @param {string} city.name - Name of the city.
 * @param {number} city.lat - Latitude of the city.
 * @param {number} city.lon - Longitude of the city.
 * @returns {Promise<object>} - An object containing the current weather, temperature, icon, and sunrise/sunset times.
 */
export async function getCurrentWeather (city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()

  return {
    name: city.name,
    lat: city.lat,
    lon: city.lon,
    temp: `${Math.round(data.main.temp)}°`,
    tempFeel: `${Math.round(data.main.feels_like)}°`,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    clouds: `${data.clouds.all}%`,
    humidity: `${data.main.humidity}%`,
    rainfall: data.rain?.['1h'] ? `${data.rain['1h']} mm` : '0 mm',
    windspeed: `${data.wind.speed} m/s`,
    weather: `${data.weather[0].main}`,
    weatherDescription: `${data.weather[0].description}`,
    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('sv-SE', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit'
    }),
    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('sv-SE', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

