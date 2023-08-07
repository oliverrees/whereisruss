import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

interface InfoWindowProps {
  children: React.ReactNode;
}

export const InfoWindow = ({ children }: InfoWindowProps) => {
  return (
    <div className="mb-4">
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Important Information
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>{children}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
