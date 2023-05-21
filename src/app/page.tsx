import { supabase } from "./lib/supabaseClient";
import length from "@turf/length";
import dynamic from "next/dynamic";
import PlausibleProvider from "next-plausible";
const Map = dynamic(() => import("./components/Map"), { ssr: false });

async function getData() {
  // Get GEOJson
  const { data, error } = await supabase
    .from("russ-activities")
    .select("geo_json");

  if (error) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  return data;
}

export default async function Page() {
  const data = await getData();

  const totalDistance = data.reduce((total, activity) => {
    const distance = length(activity.geo_json);
    return total + distance;
  }, 0);

  console.log(totalDistance);

  // Process coords of all activities
  const titles: any = [];
  const allCoords = data.map((activity) => {
    titles.push(activity.geo_json.features[0].properties.name);
    return activity.geo_json.features[0].geometry.coordinates;
  });

  // Reverse the first and second numbers in each coordinate pair
  allCoords.forEach((activity) => {
    activity.forEach((coordinate: any) => {
      const temp = coordinate[0];
      coordinate[0] = coordinate[1];
      coordinate[1] = temp;
    });
  });

  return (
    <>
      <Stats totalDistance={totalDistance} />
      <Map coords={allCoords} titles={titles} />
    </>
  );
}

const Stats = ({ totalDistance }: any) => {
  return (
    <PlausibleProvider domain="whereisruss.vercel.app">
      <div className="fixed bottom-10 right-10 bg-white z-20 p-4">
        <h1>Total distance: {totalDistance.toFixed(0)} km</h1>
        <h1>Approx distance remaining {15000 - totalDistance.toFixed(0)} km</h1>
      </div>
    </PlausibleProvider>
  );
};
