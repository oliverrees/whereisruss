"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PencilIcon, PlusIcon } from "@heroicons/react/20/solid";

import length from "@turf/length";

interface sidebarProps {
  dayData: any;
  open: boolean;
  setOpen: any;
  data: any;
}

export default function Sidebar({
  dayData,
  open,
  setOpen,
  data,
}: sidebarProps) {
  const relevantI = dayData.i;
  const relevantData = data[relevantI];
  const distanceCovered = relevantI
    ? length(relevantData.geo_json).toFixed(0)
    : 0;
  let elevation = 0;
  if (open) {
    // Calculate elevation
    const { coordinates } = relevantData.geo_json.features[0].geometry;
    coordinates.forEach((coord: any, index: any) => {
      if (index === coordinates.length - 1) return; // stop 1 point early since comparison requires 2 points
      const elevationDifference =
        coordinates[index + 1][2] - coordinates[index][2];
      if (elevationDifference > 0) elevation += elevationDifference;
    });
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={setOpen}>
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
                  <div className="h-full overflow-y-auto bg-white p-8">
                    <div className="space-y-6 pb-16">
                      <div>
                        <div className="mt-4 flex items-start justify-between">
                          <div>
                            <h2 className="text-base font-semibold leading-6 text-xl text-gray-900">
                              {dayData.title}
                            </h2>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Stats</h3>
                        <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Distance Covered</dt>
                            <dd className="text-gray-900">
                              {distanceCovered} KM
                            </dd>
                          </div>
                          <div className="flex justify-between py-3 text-sm font-medium">
                            <dt className="text-gray-500">Elevation</dt>
                            <dd className="text-gray-900">
                              {elevation.toFixed(0)} M
                            </dd>
                          </div>
                        </dl>
                      </div>
                      {/* <div className="aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg">
                        <blockquote class="twitter-tweet">
                          <p lang="en" dir="ltr">
                            Day 33 of running the entire length of Africa.
                            Incredible support out here today🫡🇳🇦{" "}
                            <a href="https://t.co/J7kicV8t6u">
                              pic.twitter.com/J7kicV8t6u
                            </a>
                          </p>
                          &mdash; Russ (@hardestgeezer){" "}
                          <a href="https://twitter.com/hardestgeezer/status/1661422199704518682?ref_src=twsrc%5Etfw">
                            May 24, 2023
                          </a>
                        </blockquote>{" "}
                        <script
                          async
                          src="https://platform.twitter.com/widgets.js"
                          charset="utf-8"
                        ></script>
                      </div> */}
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
