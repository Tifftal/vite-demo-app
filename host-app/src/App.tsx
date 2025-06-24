import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
// import Weather from "weather/weather-app";
// import News from "news/news-app";

const Weather = lazy(
  async () =>
    import("weather/weather-app") as Promise<{
      default: React.FC<{ baseUrl: string }>;
    }>
);
const News = lazy(
  async () =>
    import("news/news-app") as Promise<{
      default: React.FC<{ baseUrl: string }>;
    }>
);

function App() {
  return (
    <>
      <nav style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <Link to="/">Главная</Link>
        <Link to="/news">Новости</Link>
        <Link to="/weather">Погода</Link>
      </nav>

      <Suspense fallback={<div>Загрузка...</div>}>
        <ErrorBoundary fallback={<div>Ошибка загрузки</div>}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/news/*" element={<News baseUrl="/news" />} />
            <Route path="/weather/*" element={<Weather baseUrl="/weather" />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

export default App;
