"use client";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
interface Props {
  data: any;
  onChangeShowPins: (pinStatus: boolean) => void;
  showPins: boolean;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const revalidate = 600;

const StatsTable = ({ data, onChangeShowPins, showPins }: Props) => {
  const [endDate, setEndDate] = useState<any>("..");
  const daysRemaining = ((15000 - data.totalDistance) / 60).toFixed(0);
  const [miles, setMiles] = useState(false);
  const [expandStats, setExpandStats] = useState(false);

  useEffect(() => {
    const endDate = addDays(new Date(), parseInt(daysRemaining));
    setEndDate(endDate);
  }, [daysRemaining]);

  const stats = [
    {
      label: "Total distance",
      value: {
        km: data.totalDistance.toFixed(1),
        miles: (data.totalDistance * 0.621371).toFixed(1),
      },
      alwaysShow: true,
    },
    {
      label: "Most recent distance",
      value: {
        km: data.lastDistance.toFixed(0),
        miles: (data.lastDistance * 0.621371).toFixed(0),
      },
      alwaysShow: true,
    },
    {
      label: "Distance remaining",
      value: {
        km: (15000 - parseInt(data.totalDistance.toFixed(0))).toFixed(0),
        miles: (
          (15000 - parseInt(data.totalDistance.toFixed(0))) *
          0.621371
        ).toFixed(0),
        alwaysShow: false,
      },
    },
  ];
  return (
    <div className="bg-white py-0.5 md:py-0">
      <table className="w-full divide-y divide-gray-300 lg:flex ">
        <tbody className="divide-y divide-gray-200 w-full">
          {stats.map((stat) => (
            <tr
              key={stat.label}
              className={classNames(
                !expandStats && !stat.alwaysShow && "hidden",
                "flex justify-between "
              )}
            >
              <td className="px-4 py-3 text-xs md:text-sm font-medium text-gray-900 capitalize">
                {stat.label}
              </td>
              <td className="px-4 py-3 text-xs md:text-sm text-gray-500">
                {miles ? stat.value.miles : stat.value.km}
                &nbsp;
                {miles
                  ? stat.label == "Total elevation"
                    ? "ft"
                    : "miles"
                  : stat.label == "Total elevation"
                  ? "m"
                  : "km"}
              </td>
            </tr>
          ))}
          {expandStats && (
            <>
              <tr className="flex justify-between">
                <td className="px-4 py-3 text-xs md:text-sm font-medium text-gray-900 ">
                  Avg Run Pace (mins/km)
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-500">
                  {data.avgRunPace.toFixed(2)} / km
                </td>
              </tr>
              <tr className="flex justify-between">
                <td className="px-4 py-3 text-xs md:text-sm font-medium text-gray-900">
                  Total Run Time (hrs)
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-500">
                  {data.totalRunTime}
                </td>
              </tr>
              <tr className="flex justify-between">
                <td className="px-4 py-3 text-xs md:text-sm font-medium text-gray-900 capitalize">
                  Est. days Remaining
                </td>
                <td className="px-4 py-3  text-xs md:text-sm text-gray-500">
                  {daysRemaining}
                </td>
              </tr>
              <tr className="flex justify-between">
                <td className="px-4 py-3 text-xs md:text-sm font-medium text-gray-900 capitalize">
                  Est. finish date
                </td>
                <td className="px-4 py-3 text-xs md:text-sm text-gray-500">
                  {endDate != ".." ? format(endDate, "dd/MM/yyyy") : ".."}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <div
        style={{ pointerEvents: "all" }}
        className="py-2 pt-3 md:py-4 items-center bg-gray-50 justify-center gap-y-2 text-center text-xs md:text-sm font-semibold grid grid-cols-3 px-4"
      >
        <div>
          <UnitSwitch
            checkedStatus={expandStats}
            setCheckedStatus={setExpandStats}
          />
        </div>
        <div>
          <UnitSwitch
            checkedStatus={showPins}
            setCheckedStatus={onChangeShowPins}
          />
        </div>
        <div>
          <UnitSwitch checkedStatus={miles} setCheckedStatus={setMiles} />
        </div>
        <div>All Stats</div>
        <div>Show Pins</div>
        <div>KM/Miles</div>
      </div>
    </div>
  );
};

interface UnitSwitchProps {
  checkedStatus: boolean;
  setCheckedStatus: any;
}

const UnitSwitch = ({ checkedStatus, setCheckedStatus }: UnitSwitchProps) => {
  return (
    <Switch
      checked={checkedStatus}
      onChange={setCheckedStatus}
      className={classNames(
        "bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          checkedStatus ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      />
    </Switch>
  );
};

export default StatsTable;
