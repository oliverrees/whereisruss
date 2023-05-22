import React from "react";

type Props = {
  lat: number;
  lng: number;
};

async function getData(lat: number, lng: number) {
  // Fetch from open weather api
  const weatherData = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lng +
      "&appid=" +
      process.env.WEATHER_API
  );

  const data = await weatherData.json();
  return data;
}

const GetWeather = async ({ lat, lng }: Props) => {
  // const data = await getData(lat, lng);
  return <div>GetWeather</div>;
};

export default GetWeather;
