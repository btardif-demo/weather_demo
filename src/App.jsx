import { useState, useEffect } from 'react'
import './App.css'
import mossSvg from './assets/moss.svg'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const MIN_TEMP_F = 50
const MAX_PRECIP_PROBABILITY = 10

async function geocodeZip(zip) {
  const res = await fetch(`${GEOCODING_URL}?name=${zip}&countryCode=US&count=1`)
  const data = await res.json()
  if (!data.results?.length) throw new Error(`Could not find location for ZIP: ${zip}`)
  const { latitude, longitude, name, admin1 } = data.results[0]
  return { latitude, longitude, label: `${name}, ${admin1}` }
}

async function fetchForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum',
    temperature_unit: 'fahrenheit',
    timezone: 'auto',
    forecast_days: 5,
  })
  const res = await fetch(`${FORECAST_URL}?${params}`)
  return res.json()
}

function evaluateDay(day) {
  const checks = []
  const tempOk = day.tempMax >= MIN_TEMP_F && day.tempMin > 32
  checks.push({
    label: 'Temperature',
    pass: tempOk,
    detail: `${Math.round(day.tempMin)}°F – ${Math.round(day.tempMax)}°F (need ≥${MIN_TEMP_F}°F, no frost)`,
  })
  const rainOk = day.precipProb <= MAX_PRECIP_PROBABILITY
  checks.push({
    label: 'Rain probability',
    pass: rainOk,
    detail: `${day.precipProb}% (need ≤${MAX_PRECIP_PROBABILITY}%)`,
  })
  const dryOk = day.precipSum === 0
  checks.push({
    label: 'Precipitation',
    pass: dryOk,
    detail: `${day.precipSum} in (need 0)`,
  })
  return { allGood: tempOk && rainOk && dryOk, checks }
}

function App() {
  const [zip, setZip] = useState('')
  const [location, setLocation] = useState(null)
  const [days, setDays] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dark, setDark] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const z = params.get('zip')
    if (z) {
      setZip(z)
      loadWeather(z)
    }
  }, [])

  async function loadWeather(zipCode) {
    setLoading(true)
    setError(null)
    setDays([])
    setLocation(null)
    try {
      const geo = await geocodeZip(zipCode)
      setLocation(geo.label)
      const forecast = await fetchForecast(geo.latitude, geo.longitude)
      const d = forecast.daily
      const parsed = d.time.map((date, i) => ({
        date,
        tempMax: d.temperature_2m_max[i],
        tempMin: d.temperature_2m_min[i],
        precipProb: d.precipitation_probability_max[i],
        precipSum: d.precipitation_sum[i],
      }))
      setDays(parsed)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (zip) {
      window.history.replaceState(null, '', `?zip=${zip}`)
      loadWeather(zip)
    }
  }

  return (
    <>
      <nav className="command-bar">
        <div className="command-bar-title">
          <img src={mossSvg} alt="Moss" className="header-emoji bar-emoji" />
          <span className="bar-title">Moss Killer Weather Checker</span>
        </div>
        <form onSubmit={handleSubmit} className="zip-form">
          <input
            type="text"
            placeholder="Enter ZIP code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            maxLength={5}
            pattern="\d{5}"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Checking…' : 'Check Weather'}
          </button>
        </form>
        <button className="theme-toggle" onClick={() => setDark((d) => !d)} title="Toggle dark/light mode">
          {dark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--aurora-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--aurora-green)" stroke="var(--aurora-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </nav>

      <div className="app">
        <div className="header">
          <img src={mossSvg} alt="Moss" className="header-emoji" />
          <div className="header-text">
            <h1>Moss Killer Weather Checker</h1>
            <p className="subtitle">
              Check if conditions are right to apply lawn moss killer
            </p>
          </div>
        </div>

        {error && <p className="error">⚠️ {error}</p>}

        {!location && !loading && !error && (
          <div className="welcome">
            <p className="welcome-prompt">Enter your ZIP code to check if weather conditions are right for applying lawn moss killer.</p>
            <form onSubmit={handleSubmit} className="welcome-form">
              <input
                type="text"
                placeholder="e.g. 98101"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                maxLength={5}
                pattern="\d{5}"
                required
              />
              <button type="submit">Check Weather</button>
            </form>
            <ul className="welcome-hints">
              <li>Checks temperature, rain probability &amp; precipitation</li>
              <li>Shows a 5-day forecast at a glance</li>
              <li>Tip: bookmark with <code>?zip=12345</code> to skip this step</li>
            </ul>
          </div>
        )}

        {location && <h2>Forecast for {location}</h2>}

        <div className="forecast-grid">
          {days.map((day) => {
            const { allGood, checks } = evaluateDay(day)
            return (
              <div key={day.date} className={`day-card ${allGood ? 'good' : 'bad'}`}>
                <h3>{new Date(day.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
                <div className={`verdict ${allGood ? 'good' : 'bad'}`}>
                  {allGood ? '✅ Good to apply' : '❌ Not recommended'}
                </div>
                <ul className="checks">
                  {checks.map((c) => (
                    <li key={c.label} className={c.pass ? 'pass' : 'fail'}>
                      <span>{c.pass ? '✓' : '✗'}</span> <strong>{c.label}:</strong> {c.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default App
