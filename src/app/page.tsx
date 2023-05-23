import { supabase } from "./lib/supabaseClient";
import length from "@turf/length";
import dynamic from "next/dynamic";
import PlausibleProvider from "next-plausible";
const Map = dynamic(() => import("./components/Map"), { ssr: false });
import Stats from "./components/Stats";
import { processData } from "./functions/processData";

export const revalidate = 60;

export default async function Page() {
  const { data, error } = await supabase
    .from("russ-activities")
    .select("geo_json, activity_id")
    .order("activity_id", { ascending: false });
  const processedData = processData(data);

  return (
    <PlausibleProvider domain="whereisruss.vercel.app">
      <div className="w-full h-full overflow-hidden">
        <Stats
          totalDistance={processedData.totalDistance}
          lastDistance={processedData.lastDistance}
          coords={processedData.allCoords}
        />
        <Map coords={processedData.allCoords} titles={processedData.titles} />
      </div>
    </PlausibleProvider>
  );
}
