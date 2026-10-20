import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(countries => {
        setCountries(countries)
      }) 
  }, [])

  const handleShow = (country) => {
    setSearch(country.name.common)
    weatherService
      .getWeather(country.capital)
      .then(weatherData => {
        setWeather(weatherData)
      })
  }

  const filteredCountries = search 
    ? countries.filter(country =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    )
    : []

  return (
    <div>
      <h1>Country Explorer</h1>
      <p>Find a country and discover more about it.</p>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Type a country name..."
      />
      {filteredCountries.length > 10 ? (
        <p>Too many matches, please refine your search.</p>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <p>Capital: {filteredCountries[0].capital}</p>
          <p>Area: {filteredCountries[0].area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(filteredCountries[0].languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img src={filteredCountries[0].flags.png} alt={`Flag of ${filteredCountries[0].name.common}`} />
          <h2>Weather in {filteredCountries[0].capital}</h2>
          {weather && (
            <div>
              <p>Temperature: {weather.main.temp} Celcius</p>
              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>
      ) : 
      (<ul>
        {filteredCountries.map(country => (
          <li key={country.cca3}>
            {country.name.common}
            {' '}
            <button onClick={() => handleShow(country)}>Show</button>
          </li>
        ))}
      </ul> )}
    </div>
  )
}

export default App