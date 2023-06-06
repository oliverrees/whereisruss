import { differenceInDays, format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import { length, lineString } from "@turf/turf";
import Weather from "./Weather";

interface sidebarProps {
  data: any;
  processedData: any;
  open: boolean;
  setOpen: any;
  day: any;
}

export const revalidate = 600;

const getElevation = (geojson: any) => {
  const elevationData = lineString(
    geojson.coordinates
  ).geometry.coordinates.map((coord) => coord[2]);
  let totalGain = 0;

  for (let i = 0; i < elevationData.length - 1; i++) {
    const elevationDiff = elevationData[i + 1] - elevationData[i];
    if (elevationDiff > 0) {
      totalGain += elevationDiff;
    }
  }
  return totalGain.toFixed(0);
};

export default function Sidebar({
  open,
  setOpen,
  day,
  data,
  processedData,
}: sidebarProps) {
  const [weather, setWeather] = useState<any>(null);
  const activityId = data[day].activity_id;
  useEffect(() => {
    if (open) {
      const getWeatherData = async () => {
        const { data } = await supabase
          .from("russ-activities")
          .select("weather")
          .eq("activity_id", activityId);
        if (data) {
          setWeather(data[0].weather);
        }
      };
      getWeatherData();
    }
  }, [open]);

  const closeSidebar = () => {
    setOpen(false);
    setTimeout(() => {
      setWeather(null);
    }, 500);
  };

  const startDate = new Date("2023-04-22");
  const relevantData = data[day];
  const distance = length(relevantData.geo_json);
  const elevation = getElevation(relevantData.geo_json.features[0].geometry);
  const title =
    "Day " + (differenceInDays(new Date(relevantData.date), startDate) + 1);

  const stravaLink = `https://www.strava.com/activities/${relevantData.activity_id}`;
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={closeSidebar}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-96">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full overflow-y-auto bg-white p-8 pb-36">
                    <div className="space-y-6 pb-16">
                      <div>
                        <div className="mt-4 flex items-start justify-between">
                          <div>
                            <h2 className="font-semibold leading-6 text-3xl text-gray-900">
                              {title}
                            </h2>
                            <p className="mt-3 text-sm text-gray-500">
                              {format(
                                new Date(relevantData.date),
                                "dd/MM/yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Stats</h3>
                        <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Distance Covered*</dt>
                            <dd className="text-gray-900">
                              {distance.toFixed(0)} KM
                            </dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">True Elevation**</dt>
                            <dd className="text-gray-900">{elevation} M</dd>
                          </div>
                        </dl>
                      </div>
                      {weather && (
                        <Weather weather={weather} date={relevantData.date} />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 w-full">
                        <div className="p-4 text-gray-400 bg-white border-t text-xs">
                          <div>
                            * Distance measured with smooth geoJSON data to save
                            on file space - accurate to ~1km. See Strava for the
                            actual value.
                          </div>
                          <div className="mt-2">
                            ** True elevation measured with raw GPX data. This
                            may differ from Strava's elevation which uses a per
                            split model.
                          </div>
                        </div>
                        <Link
                          href={stravaLink}
                          target="_blank"
                          className="w-full flex justify-center bg-orange-600 px-3 py-4 text-sm font-semibold text-white text-center"
                        >
                          View on Strava
                        </Link>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
