# Weather API Options

## Recommended: Open-Meteo (simplest)

- **Free**, no API key required, open-source
- 7–16 day forecast with temperature, precipitation probability, humidity, wind
- Docs: [open-meteo.com/en/docs](https://open-meteo.com/en/docs)

**Example call:**

```
https://api.open-meteo.com/v1/forecast?latitude=47.6&longitude=-122.3&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5
```

## Other Options

| API | Free Tier | API Key | Notes |
|---|---|---|---|
| **Open-Meteo** | ✅ | Not needed | Simplest to get started |
| **OpenWeatherMap** | ✅ | Required | Most popular, 5-day/3-hour forecast |
| **WeatherAPI.com** | ✅ | Required | Feature-rich, hourly rain chance |
| **Tomorrow.io** | ✅ | Required | 14-day forecast, very detailed |

## Key Fields for Moss Out! Conditions

- **`temperature_2m_max`** — must be above 50°F / 10°C
- **`precipitation_probability_max`** — should be 0% for the application day + next day
- **`precipitation_sum`** — confirm no rain expected
