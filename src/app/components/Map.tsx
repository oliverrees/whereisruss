"use client";
import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { Polyline } from "react-leaflet/Polyline";
import { useMap } from "react-leaflet/hooks";

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
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {coords.map((activity, i) => {
            return (
              <>
                <Polyline
                  key={activity.id}
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
              </>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
