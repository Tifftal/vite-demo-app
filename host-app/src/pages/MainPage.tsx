/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "../assets/main.svg";

const MainPage = () => {
  return (
    <div>
      <h1>Главная</h1>
      <img src={Image} />
      <img src="/images_cache.png" />
    </div>
  );
};

export default MainPage;
