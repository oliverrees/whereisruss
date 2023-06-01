"use client";
import React from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

type Props = {
  data: any;
  processedData: any;
  setOpen: any;
  setDayNumber: any;
};

const color = [
  "#FF0000",
  "#FFA500",
  "#FFFF00",
  "#008000",
  "#0000FF",
  "#4B0082",
  "#EE82EE",
];

const Map = ({ setOpen, setDayNumber, data, processedData }: Props) => {
  const coords = processedData.allCoords;
  const titles = processedData.titles;

  return (
    <>
      <div className="h-full fixed top-0 left-0 bottom-0 right-0 z-0 w-full">
        <MapContainer
          center={[coords[0][0][0], coords[0][0][1]]}
          zoom={7}
          className="w-full h-screen"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {coords.map((activity: any, i: number) => {
            // console.log(
            //   titles[i],
            //   "https://api.open-meteo.com/v1/forecast?latitude=" +
            //     activity[0][0].toFixed(2) +
            //     "&longitude=" +
            //     activity[0][1].toFixed(2) +
            //     "&daily=temperature_2m_max,temperature_2m_min,uv_index_max,windspeed_10m_max,shortwave_radiation_sum&past_days=61&forecast_days=1&timezone=auto"
            // );
            return (
              <div key={i}>
                <Polyline
                  pathOptions={{ fillColor: "red", color: color[0] }}
                  positions={activity}
                />
                {titles[i] && (
                  <Marker
                    icon={L.icon({
                      iconUrl: "/marker-icon-2x.png",
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                    })}
                    eventHandlers={{
                      click: (e) => {
                        setOpen(true);
                        setDayNumber(i);
                      },
                    }}
                    position={activity[activity.length - 1]}
                  />
                )}
              </div>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
