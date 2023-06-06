import React from "react";
import { FaSun, FaTemperatureHigh, FaWind } from "react-icons/fa";

type Props = {
  data: any;
};

export const revalidate = 600;

const LiveWeather = ({ data }: Props) => {
  const dailyWeather = data.daily;
  return (
    <>
      <div className="fixed top-3 md:top-8 z-20 left-0 w-full flex justify-center pointer-events-none">
        <div className="shadow-lg bg-white p-2 md:p-4 rounded-lg ml-14 mr-2 md:m-0 text-center">
          <div className="grid grid-cols-4 gap-4 text-sm md:text-md">
            <div className="flex flex-col items-center">
              <FaTemperatureHigh className="h-4 w-4 text-blue-500 mx-auto" />
              <div className=" md:text-xl font-semibold mt-2">
                {dailyWeather.temperature_2m_min[0]}&deg;c
              </div>
              <div className="hidden md:flex">Min Temp</div>
            </div>
            <div className="flex flex-col items-center">
              <FaTemperatureHigh className="h-4 w-4  text-red-500 mx-auto" />
              <div className=" md:text-xl font-semibold mt-2">
                {dailyWeather.temperature_2m_max[0]}&deg;c
              </div>
              <div className="hidden md:flex">Max Temp</div>
            </div>
            <div className="flex flex-col items-center">
              <FaSun className="h-4 w-4  mx-auto text-orange-500" />
              <div className=" md:text-xl font-semibold mt-2">
                {dailyWeather.uv_index_max[0]}
              </div>
              <div className="hidden md:flex">UV Index</div>
            </div>
            <div className="flex flex-col items-center">
              <FaWind className="h-4 w-4 mx-auto" />
              <div className=" md:text-xl font-semibold mt-2">
                {dailyWeather.windspeed_10m_max[0]}
                <span className="text-xs"> km/h</span>
              </div>
              <div className="hidden md:flex">Max Windspeed</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveWeather;
