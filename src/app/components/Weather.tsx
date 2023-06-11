import React from "react";
import { FaTemperatureHigh, FaWind, FaSun } from "react-icons/fa";
type Props = {
  weather: any;
  date: any;
};

const Weather = ({ weather, date }: Props) => {
  const position = weather.daily.time.indexOf(date);
  const maxTemp = weather.daily.temperature_2m_max[position];
  const minTemp = weather.daily.temperature_2m_min[position];
  const uvIndex = weather.daily.uv_index_max[position];
  const windSpeed = weather.daily.windspeed_10m_max[position];

  return (
    <div>
      <div className="font-semibold border-b pb-2 border-gray-200">
        Weather Conditions
      </div>
      <div className="grid gap-2 mt-4 grid-cols-2 ">
        <div className="border p-4 text-center rounded">
          <FaTemperatureHigh className="h-7 w-7 text-blue-500 mx-auto" />
          <div className="text-2xl font-semibold mt-2">{minTemp}&deg;c</div>
          <div className="text-xs mt-2">Min Temp</div>
        </div>
        <div className="border p-4 text-center rounded">
          <FaTemperatureHigh className="h-7 w-7 text-red-500 mx-auto" />
          <div className="text-2xl font-semibold mt-2">{maxTemp}&deg;c</div>
          <div className="text-xs mt-2">Max Temp</div>
        </div>
      </div>
      <div className="border p-4 text-center mt-2 rounded">
        <FaSun className="h-7 w-7 mx-auto text-orange-500" />
        <div className="text-2xl font-semibold mt-2">{uvIndex}</div>
        <div className="text-xs mt-2">UV Index</div>
      </div>
      <div className="border p-4 text-center mt-2 rounded">
        <FaWind className="h-7 w-7 mx-auto" />
        <div className="text-2xl font-semibold mt-2">{windSpeed} km/h</div>
        <div className="text-xs mt-2">Max Windspeed</div>
      </div>
    </div>
  );
};

export default Weather;
