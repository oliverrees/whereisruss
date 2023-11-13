"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Map from "./Map";

interface Props {
  data: any;
  processedData: any;
  showPins: boolean;
  metaData: any;
}

const MapHolder = ({ data, processedData, showPins, metaData }: Props) => {
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
        metaData={metaData}
      />
      <Map
        showPins={showPins}
        data={data}
        setOpen={setOpen}
        setDayNumber={setDayNumber}
        processedData={processedData}
      />
    </>
  );
};

export default MapHolder;
