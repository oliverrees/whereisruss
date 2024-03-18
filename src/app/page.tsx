import { supabase } from "./lib/supabaseClient";
import dynamic from "next/dynamic";
import PlausibleProvider from "next-plausible";
const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => <Loading />,
});
import { processData } from "./functions/processData";
import LiveWeather from "./components/LiveWeather";
import Loading from "./components/Loading";

export const revalidate = 600;

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
    { next: { revalidate: 600 } }
  );
  return await liveWeather.json();
}

async function getData() {
  const { data, error } = await supabase
    .from("russ-activities")
    .select("id, geo_json, activity, activity_id, date")
    .order("date", { ascending: false });
  if (error) console.log("error", error);
  return data;
}

export default async function Page() {
  const retrievedData: any = await getData();
  const filteredData = retrievedData.map((activity: any) => {
    // Reverse the first and second numbers in each coordinate pair for leaflet
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
      return activity;
    }
  });

  const liveWeather = await getLiveWeather(filteredData);

  const [locationData, liveWeatherData] = await Promise.all([
    filteredData,
    liveWeather,
  ]);
  const data = processData(locationData);

  return (
    <PlausibleProvider domain="whereisruss.vercel.app">
      <div className="w-full h-full overflow-hidden">
        <LiveWeather data={liveWeatherData} />
        <Map data={data} />
      </div>
    </PlausibleProvider>
  );
}
