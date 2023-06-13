"use client";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
interface Props {
  totalDistance: number;
  lastDistance: number;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const revalidate = 600;

const StatsTable = ({ lastDistance, totalDistance }: Props) => {
  const [endDate, setEndDate] = useState<any>("..");
  const daysRemaining = ((15000 - totalDistance) / 60).toFixed(0);
  const [miles, setMiles] = useState(false);

  useEffect(() => {
    const endDate = addDays(new Date(), parseInt(daysRemaining));
    setEndDate(endDate);
  }, [daysRemaining]);

  const stats = [
    {
      label: "Most Recent Distance",
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
      label: "Est. Distance remaining",
      value: {
        km: (15000 - parseInt(totalDistance.toFixed(0))).toFixed(0),
        miles: (
          (15000 - parseInt(totalDistance.toFixed(0))) *
          0.621371
        ).toFixed(0),
      },
    },
  ];

  return (
    <div className="bg-white py-0.5 md:py-0">
      <table className="w-full divide-y divide-gray-300 ">
        <tbody className="divide-y divide-gray-200">
          {stats.map((stat) => (
            <tr key={stat.label}>
              <td className="px-4 py-0 md:py-4 text-xs md:text-sm font-medium text-gray-900">
                {stat.label}
              </td>
              <td className="px-4 py-2 md:py-4 text-xs md:text-sm text-gray-500">
                {miles ? stat.value.miles : stat.value.km}
                &nbsp;
                {miles ? "miles" : "km"}
              </td>
            </tr>
          ))}
          <tr>
            <td className="px-4 py-0 md:py-4 text-xs md:text-sm font-medium text-gray-900">
              Est. Days Remaining
            </td>
            <td className="px-4 py-2 md:py-4 text-xs md:text-sm text-gray-500">
              {daysRemaining}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-0 md:py-4 text-xs md:text-sm font-medium text-gray-900">
              Est. Finish Date
            </td>
            <td className="px-4 py-2 md:py-4 text-xs md:text-sm text-gray-500 w-48">
              {endDate != ".." ? format(endDate, "dd/MM/yyyy") : ".."}
            </td>
          </tr>
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
      <div
        style={{ pointerEvents: "all" }}
        className="z-10 relative py-2 md:py-4 flex items-center bg-gray-50 justify-center gap-x-4 text-xs md:text-sm font-semibold"
      >
        Kilometres
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

export default StatsTable;
