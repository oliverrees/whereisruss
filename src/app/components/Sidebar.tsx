import { differenceInDays, format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import Weather from "./Weather";
import { InfoWindow } from "./InfoWindow";

interface sidebarProps {
  data: any;
  open: boolean;
  setOpen: any;
  day: any;
}

export const revalidate = 600;

export default function Sidebar({ open, setOpen, day, data }: sidebarProps) {
  const [weather, setWeather] = useState<any>(null);
  const activityId = data.rawData[day].activity_id;
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
  const relevantData = data.rawData[day];

  const distance = relevantData.activity ? relevantData.activity.distance : "?";
  const elevation = relevantData.activity
    ? relevantData.activity.elevation
    : "?";
  const movingTime = relevantData.activity
    ? relevantData.activity.movingTime
    : "?";

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
                  <div className="h-full overflow-y-auto bg-white p-8 pb-24">
                    <div className="space-y-6">
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
                        {relevantData.activity_id === "9584255228" && (
                          <InfoWindow>
                            Russ was separated from the support van after some
                            impassable roads in the planned route.{" "}
                            <Link
                              href="https://twitter.com/hardestgeezer/status/1688280312441102337"
                              target="new"
                              className="underline"
                            >
                              Read more here
                            </Link>
                          </InfoWindow>
                        )}
                        <h3 className="font-medium text-gray-900">Stats</h3>
                        <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Distance Covered</dt>
                            <dd className="text-gray-900">{distance}</dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Elevation</dt>
                            <dd className="text-gray-900">{elevation}</dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Moving Time</dt>
                            <dd className="text-gray-900">{movingTime}</dd>
                          </div>
                        </dl>
                      </div>
                      {weather && (
                        <Weather weather={weather} date={relevantData.date} />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 w-full">
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
