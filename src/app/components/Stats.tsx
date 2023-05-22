"use client";
import React, { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";
import { Switch } from "@headlessui/react";
import Link from "next/link";
import GetWeather from "./GetWeather";

type Props = {
  totalDistance: number;
  lastDistance: number;
  coords: any;
};

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const Stats = ({ totalDistance, lastDistance, coords }: Props) => {
  const [miles, setMiles] = useState(false);
  const stats = [
    {
      label: "Yesterday's Distance",
      value: {
        km: lastDistance.toFixed(0),
        miles: (lastDistance * 0.621371).toFixed(0),
      },
    },
    {
      label: "Total distance",
      value: {
        km: totalDistance.toFixed(0),
        miles: (totalDistance * 0.621371).toFixed(0),
      },
    },
    {
      label: "Approx distance remaining",
      value: {
        km: (15000 - parseInt(totalDistance.toFixed(0))).toFixed(0),
        miles: (
          (15000 - parseInt(totalDistance.toFixed(0))) *
          0.621371
        ).toFixed(0),
      },
    },
  ];
  const timeSinceStart = differenceInDays(new Date(), new Date(2023, 3, 21));
  return (
    <div className="fixed bottom-0 md:bottom-10 left-0 md:left-10 right-0 md:right-10 overflow-hidden bg-white shadow-lg md:rounded-lg z-20 md:max-w-sm">
      <div className="bg-gray-50 pb-2 pt-4">
        <div className="text-xl md:text-4xl font-bold pl-4">
          Day {timeSinceStart}
        </div>
        <div className="pl-4 pt-2 font-semibold text-sm">#ProjectAfrica</div>
        <div className="pl-4 mt-2 mb-2 md:mb-4 text-xs flex gap-x-4">
          <Link
            target="_blank"
            className="border-b"
            href="https://www.strava.com/athletes/22704023"
          >
            Strava
          </Link>
          <Link
            target="_blank"
            className="border-b"
            href="https://www.patreon.com/HardestGeezer"
          >
            Patreon
          </Link>
          <Link
            target="_blank"
            className="border-b"
            href="https://www.youtube.com/@hardestgeezer"
          >
            Youtube
          </Link>
          <Link
            target="_blank"
            className="border-b"
            href="https://twitter.com/hardestgeezer"
          >
            Twitter
          </Link>
        </div>
      </div>
      <table className="w-full divide-y divide-gray-300">
        <tbody className="divide-y divide-gray-200">
          {stats.map((stat) => (
            <tr key={stat.label}>
              <td className="px-4 py-0 md:py-4 text-xs md:text-sm font-medium text-gray-900">
                {stat.label}
              </td>
              <td className="px-4 py-2 md:py-4 text-sm text-gray-500">
                {miles ? stat.value.miles : stat.value.km}{" "}
                {miles ? "miles" : "km"}
              </td>
            </tr>
          ))}
          {/* <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Weather at last location
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <GetWeather lat={coords[0][0][0]} lng={coords[0][0][1]} />
            </td>
          </tr> */}
        </tbody>
      </table>
      <div className="py-2 md:py-4 flex items-center bg-gray-50 justify-center gap-x-4 text-xs md:text-sm font-semibold">
        KM
        <UnitSwitch miles={miles} setMiles={setMiles} />
        Miles
      </div>
    </div>
  );
};

interface UnitSwitchProps {
  miles: boolean;
  setMiles: any;
}

const UnitSwitch = ({ miles, setMiles }: UnitSwitchProps) => {
  return (
    <Switch
      checked={miles}
      onChange={setMiles}
      className={classNames(
        "bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          miles ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      />
    </Switch>
  );
};

export default Stats;
