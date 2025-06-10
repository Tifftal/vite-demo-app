import { Link, Route, Routes } from "react-router-dom";
import Week from "./pages/Week";
import Today from "./pages/Today";

type WeatherProps = {
  baseUrl?: string;
};

const App: React.FC<WeatherProps> = ({ baseUrl }) => {
  return (
    <div>
      <div>WEATHER</div>
      <nav style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <Link to={`${baseUrl}`}>Неделя</Link>
        <Link to={`${baseUrl}/today`}>Сегодня</Link>
      </nav>
      <Routes>
        <Route path="" element={<Week />} />
        <Route path="today" element={<Today />} />
      </Routes>
    </div>
  );
};

export default App;
