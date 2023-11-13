"use client";
import { supabase } from "./lib/supabaseClient";
import { useState } from "react";
import dynamic from "next/dynamic";
import PlausibleProvider from "next-plausible";
const MapHolder = dynamic(() => import("./components/MapHolder"), {
  ssr: false,
});
import Stats from "./components/Stats";
import { processData } from "./functions/processData";
import LiveWeather from "./components/LiveWeather";
import INITIAL_DATA from "./data/lowerResDay128.json";

export const revalidate = 0;

async function getLiveWeather(data: any) {
  if (!data) return;
  const lastLat = data[0].geo_json.features[0].geometry.coordinates[0][1];
  const lastLng = data[0].geo_json.features[0].geometry.coordinates[0][0];

  const liveWeather = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=" +
      lastLat +
      "&longitude=" +
      lastLng +
      "&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max,precipitation_probability_max&forecast_days=1&timezone=auto",
    { next: { revalidate: 60 } }
  );
  return await liveWeather.json();
}

async function getData() {
  const { data, error } = await supabase
    .from("russ-activities")
    .select("geo_json, activity, activity_id, date")
    .order("date", { ascending: false });
  if (error) console.log("error", error);
  return data;
}

export default async function Page() {
  const [showPins, setShowPins] = useState(true);
  const data: any = await getData();
  let metaData: any = {};

  const newData = data
    .map((activity: any) => {
      // Reverse the first and second numbers in each coordinate pair
      try {
        activity.geo_json.features[0].geometry.coordinates.forEach(
          (coordinate: number[]) => {
            const temp = coordinate[0];
            coordinate[0] = coordinate[1];
            coordinate[1] = temp;
          }
        );
        return activity;
      } catch (error) {
        metaData[activity.activity_id] = activity.activity;
      }
    })
    .filter((activity: any) => activity !== undefined);

  const initialDataWithMeta = INITIAL_DATA.map((activity: any) => {
    return {
      ...activity,
      activity: metaData[activity.activity_id],
    };
  });

  const joinedData: any = newData.concat(initialDataWithMeta);

  const liveWeather = await getLiveWeather(joinedData);

  const [locationData, liveWeatherData] = await Promise.all([
    joinedData,
    liveWeather,
  ]);
  const processedData = processData(locationData);

  return (
    <PlausibleProvider domain="whereisruss.vercel.app">
      <div className="w-full h-full overflow-hidden">
        <LiveWeather data={liveWeatherData} />
        <Stats
          processedData={processedData}
          showPins={showPins}
          setShowPins={setShowPins}
        />
        <MapHolder
          data={joinedData}
          processedData={processedData}
          showPins={showPins}
        />
      </div>
    </PlausibleProvider>
  );
}
