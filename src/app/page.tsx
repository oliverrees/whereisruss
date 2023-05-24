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
  const [data, setData]: any = useState([]);
  const [rawData, setRawData]: any = useState([]);
  const [dayNumber, setDayNumber] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from("russ-activities")
        .select("geo_json, activity_id")
        .order("activity_id", { ascending: false });
      setData(processData(data));
      setRawData(data);
    };
    getData();
  }, []);

  if (data.length == 0) return <Loading />;
  return (
    <PlausibleProvider domain="whereisruss.vercel.app">
      <div className="w-full h-full overflow-hidden">
        <Sidebar
          open={open}
          setOpen={setOpen}
          rawData={rawData}
          day={dayNumber}
        />
        <Stats
          totalDistance={data.totalDistance}
          lastDistance={data.lastDistance}
          coords={data.allCoords}
        />
        <Map
          coords={data.allCoords}
          titles={data.titles}
          setOpen={setOpen}
          setDayNumber={setDayNumber}
        />
      </div>
    </PlausibleProvider>
  );
}
