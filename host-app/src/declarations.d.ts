declare module "news/news-app" {
  interface NewsProps {
    baseUrl?: string;
  }

  const App: React.ComponentType<NewsProps>;
  export default App;
}

declare module "weather/weather-app" {
  interface WeatherProps {
    baseUrl?: string;
  }

  const App: React.ComponentType<WeatherProps>;
  export default App;
}
