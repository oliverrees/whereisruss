"use client";
import React, { Suspense, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import Stats from "./Stats";
import Sidebar from "./Sidebar";
import Loading from "./Loading";

type Props = {
  data: any;
};

const Map = ({ data }: Props) => {
  const [showPins, setShowPins] = useState(true);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [showSatellite, setShowSatellite] = useState(false);
  const coords = data.allCoords;
  const titles = data.titles;
  const tileUrl = showSatellite
    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const onChangeShowPins = (pinStatus: boolean) => {
    setShowPins(pinStatus);
  };

  const onChangeShowSatellite = (satelliteStatus: boolean) => {
    setShowSatellite(satelliteStatus);
  };

  return (
    <>
      <Stats
        data={data}
        showPins={showPins}
        showSatellite={showSatellite}
        onChangeShowPins={onChangeShowPins}
        onChangeShowSatellite={onChangeShowSatellite}
      />
      <Sidebar open={open} setOpen={setOpen} activityId={id} data={data} />
      <div className="h-full fixed top-0 left-0 bottom-0 right-0 z-0 w-full">
        <MapContainer
          center={[2.6747893, 14.8896634]}
          zoom={3}
          maxZoom={12}
          minZoom={1}
          className="w-full h-screen"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={tileUrl}
          />
          {coords.map((activity: any, i: number) => {
            return (
              <div key={i}>
                <Polyline
                  pathOptions={{ fillColor: "red", color: "#FF0000" }}
                  positions={activity.coords}
                />
                {showPins && titles[i] && (
                  <Marker
                    icon={L.icon({
                      iconUrl: "/marker-icon-2x.png",
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                    })}
                    eventHandlers={{
                      click: (e) => {
                        setId(activity.activity_id);
                        setTimeout(() => setOpen(true), 100);
                      },
                    }}
                    position={[
                      activity.coords[activity.coords.length - 1][0],
                      activity.coords[activity.coords.length - 1][1],
                    ]}
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
