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
  coords: any;
  titles: any;
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

const Map = ({ coords, titles }: Props) => {
  return (
    <>
      <div className="min-h-screen z-0 relative w-full">
        <MapContainer
          center={[coords[0][0][0], coords[0][0][1]]}
          zoom={8}
          className="w-full h-screen"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {coords.map((activity: any, i: number) => {
            return (
              <div key={i}>
                <Polyline
                  pathOptions={{ fillColor: "red", color: color[0] }}
                  positions={activity}
                />
                {titles[i].indexOf("Cool") == -1 &&
                  titles[i].indexOf("Evening") == -1 && (
                    <Marker
                      icon={L.icon({
                        iconUrl: "/marker-icon-2x.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                      })}
                      position={activity[activity.length - 1]}
                    >
                      <Popup>{titles[i]}</Popup>
                    </Marker>
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
