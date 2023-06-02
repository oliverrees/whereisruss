import { supabase } from "./lib/supabaseClient";
import dynamic from "next/dynamic";
import PlausibleProvider from "next-plausible";
const MapHolder = dynamic(() => import("./components/MapHolder"), {
  ssr: false,
});
import Stats from "./components/Stats";
import Loading from "./components/Loading";
import { processData } from "./functions/processData";
import LiveWeather from "./components/LiveWeather";

export const revalidate = 60;

export default async function Page() {
  const { data, error } = await supabase
    .from("russ-activities")
    .select("geo_json, activity_id, date")
    .order("activity_id", { ascending: false });

  const getLiveWeather = async (data: any) => {
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
  };

  const processedData = processData(data);
  const liveWeather = await getLiveWeather(data);

  if (!data) return <Loading />;
  return (
    <PlausibleProvider domain="whereisruss.vercel.app">
      <div className="w-full h-full overflow-hidden">
        <LiveWeather data={liveWeather} />
        <Stats processedData={processedData} />
        <MapHolder data={data} processedData={processedData} />
      </div>
    </PlausibleProvider>
  );
}
