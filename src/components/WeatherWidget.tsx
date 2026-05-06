import { useEffect, useState } from 'react';
import { CloudSun, CloudRain, Sun, Cloud, Snowflake, Wind, Droplets, Thermometer } from 'lucide-react';

interface WeatherWidgetProps {
  city: string;
  date: string;
}

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  code: number;
}

const getWeatherIcon = (code: number) => {
  if (code === 0 || code === 1) return Sun;
  if (code >= 2 && code <= 3) return CloudSun;
  if (code >= 45 && code <= 48) return Cloud;
  if (code >= 51 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return Snowflake;
  if (code >= 80 && code <= 99) return CloudRain;
  return Cloud;
};

const getWeatherDescription = (code: number) => {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 57) return 'Freezing drizzle';
  if (code >= 61 && code <= 65) return 'Rainy';
  if (code >= 66 && code <= 67) return 'Freezing rain';
  if (code >= 71 && code <= 75) return 'Snowfall';
  if (code === 77) return 'Snow grains';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
};

const WeatherWidget = ({ city, date }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // First, geocode the city name
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
          setError(true);
          return;
        }

        const { latitude, longitude } = geoData.results[0];
        const eventDate = new Date(date).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];

        // Use forecast for upcoming dates, current for today
        let weatherRes;
        if (eventDate <= today) {
          weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
          );
        } else {
          weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weather_code&start_date=${eventDate}&end_date=${eventDate}`
          );
        }

        const weatherData = await weatherRes.json();

        if (weatherData.current) {
          setWeather({
            temp: Math.round(weatherData.current.temperature_2m),
            feelsLike: Math.round(weatherData.current.apparent_temperature),
            humidity: weatherData.current.relative_humidity_2m,
            windSpeed: Math.round(weatherData.current.wind_speed_10m),
            code: weatherData.current.weather_code,
            description: getWeatherDescription(weatherData.current.weather_code),
          });
        } else if (weatherData.daily) {
          setWeather({
            temp: Math.round(weatherData.daily.temperature_2m_max[0]),
            feelsLike: Math.round(weatherData.daily.temperature_2m_max[0]),
            humidity: 0,
            windSpeed: 0,
            code: weatherData.daily.weather_code[0],
            description: getWeatherDescription(weatherData.daily.weather_code[0]),
          });
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, date]);

  if (error || (!loading && !weather)) return null;

  if (loading) {
    return (
      <div className="p-4 rounded-xl bg-secondary/30 animate-pulse">
        <div className="h-16" />
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather!.code);

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent glow-border overflow-hidden relative">
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-[40px]" />
      <div className="relative">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
          Event Day Weather · {city}
        </p>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <WeatherIcon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-bold">{weather!.temp}°C</span>
              <span className="text-sm text-muted-foreground">{weather!.description}</span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              {weather!.feelsLike !== weather!.temp && (
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3" /> Feels {weather!.feelsLike}°C
                </span>
              )}
              {weather!.humidity > 0 && (
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" /> {weather!.humidity}%
                </span>
              )}
              {weather!.windSpeed > 0 && (
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3" /> {weather!.windSpeed} km/h
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
