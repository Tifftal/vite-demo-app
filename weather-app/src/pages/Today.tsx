/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { GetCurrentWeather } from "../services/API";

const Today = () => {
  const [currentWeather, setCurrentWeather] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      GetCurrentWeather()
        .then((res) => {
          setCurrentWeather(res.current);
        })
        .catch((e) => console.error(e))
        .finally(() => setIsLoading(false));
    }, 1000);
  }, []);

  const Image = new URL("/cold.jpg", import.meta.url);

  return (
    <div className="today">
      <div>
        <h2>Сегодня</h2>
        {isLoading && <div>Загрузка...</div>}
        {currentWeather && (
          <div className="today_container">
            <div className="today_content">
              <img
                src={`https:${currentWeather.condition.icon}`}
                alt={currentWeather.condition.text}
              />
              <p>{currentWeather.condition.text}</p>
            </div>
            <div className="today_content">
              <p>Температура: {currentWeather.temp_c} °C</p>
              <p>Ощущается как: {currentWeather.feelslike_c} °C</p>
            </div>
          </div>
        )}
      </div>
      <img src={Image.href} />
    </div>
  );
};

export default Today;
