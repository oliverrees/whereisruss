"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Map from "./Map";

interface Props {
  data: any;
  processedData: any;
}

const MapHolder = ({ data, processedData }: Props) => {
  useEffect(() => {
    console.log(data)
  }
  , [data])
  const [open, setOpen] = useState(false);
  const [dayNumber, setDayNumber] = useState(0);
  return (
    <>
      <Sidebar
        open={open}
        setOpen={setOpen}
        data={data}
        day={dayNumber}
        processedData={processedData}
      />
      <Map
        data={data}
        setOpen={setOpen}
        setDayNumber={setDayNumber}
        processedData={processedData}
      />
    </>
  );
};

export default MapHolder;
