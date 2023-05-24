"use client";
import { supabase } from "./lib/supabaseClient";
import dynamic from "next/dynamic";
import PlausibleProvider from "next-plausible";
const Map = dynamic(() => import("./components/Map"), { ssr: false });
import Stats from "./components/Stats";
import { processData } from "./functions/processData";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { set } from "date-fns";
import Loading from "./components/Loading";

export const revalidate = 0;

export default function Page() {
  const [open, setOpen] = useState(false);
  const [dayData, setDayData] = useState({});
  const [data, setData]: any = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from("russ-activities")
        .select("geo_json, activity_id")
        .order("activity_id", { ascending: false });
      setData(data);
    };
    getData();
  }, []);

  if (data.length == 0) return <Loading />;
  const processedData = processData(data);
  return (
    <PlausibleProvider domain="whereisruss.vercel.app">
      <div className="w-full h-full overflow-hidden">
        <Sidebar dayData={dayData} data={data} open={open} setOpen={setOpen} />
        <Stats
          totalDistance={processedData.totalDistance}
          lastDistance={processedData.lastDistance}
          coords={processedData.allCoords}
        />
        <Map
          coords={processedData.allCoords}
          titles={processedData.titles}
          setOpen={setOpen}
          setDayData={setDayData}
        />
      </div>
    </PlausibleProvider>
  );
}
