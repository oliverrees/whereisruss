"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PlausibleProvider from "next-plausible";
const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => <Loading />,
});
import { processData } from "./functions/processData";
import LiveWeather from "./components/LiveWeather";
import Loading from "./components/Loading";
import { supabase } from "./lib/supabaseClient";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [liveWeatherData, setLiveWeatherData] = useState(null);

  // Function to fetch activity data
  async function fetchData() {
    const { data, error } = await supabase
      .from("russ-activities")
      .select("id, geo_json, activity, activity_id, date")
      .order("date", { ascending: false });
    if (error) {
      console.log("error", error);
      return;
    }

    // Process fetched data (e.g., reversing coordinates for leaflet)
    const processedData = data.map((activity) => {
      try {
        activity.geo_json.features[0].geometry.coordinates.forEach(
          (coordinate: { 0: number; 1: number }) => {
            const temp = coordinate[0];
            coordinate[0] = coordinate[1];
            coordinate[1] = temp;
          }
        );
        return activity;
      } catch (error) {
        return activity;
      }
    });

    setData(processData(processedData));

    // Fetch live weather data for the first item's location
    if (processedData.length > 0) {
      const lastLat =
        processedData[0].geo_json.features[0].geometry.coordinates[0][0];
      const lastLng =
        processedData[0].geo_json.features[0].geometry.coordinates[0][1];
      const liveWeather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lastLat}&longitude=${lastLng}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,windspeed_10m_max,precipitation_probability_max&forecast_days=1&timezone=auto`
      );
      const weatherData = await liveWeather.json();
      setLiveWeatherData(weatherData);
    }
  }

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Conditional rendering to handle loading state
  if (!data || !liveWeatherData) return <Loading />;

  return (
    <PlausibleProvider domain="whereisruss.vercel.app">
      <div className="w-full h-full overflow-hidden">
        {/* <LiveWeather data={liveWeatherData} /> */}
        <Map data={data} />
      </div>
    </PlausibleProvider>
  );
}
