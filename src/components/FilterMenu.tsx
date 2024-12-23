import { useState } from 'react';

interface FilterMenuProps {
  activityTypes: Array<{
    name: string;
    show: [boolean, (value: boolean) => void];
  }>;
  showStaticMarkers: boolean;
  setShowStaticMarkers: (value: boolean) => void;
}

export const FilterMenu = ({ activityTypes, showStaticMarkers, setShowStaticMarkers }: FilterMenuProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col items-end absolute top-4 right-4 z-10">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-500 focus:outline-none w-32"
      >
        Filters
      </button>
      {dropdownOpen && (
        <div className="mt-2 bg-white rounded-md shadow-lg min-w-[128px]">
          <div className="p-2">
            <h3 className="font-semibold text-lg">Moving Activity</h3>
            {activityTypes.map(({ name, show: [show, setShow] }) => (
              <div key={name}>
                <label>
                  <input
                    type="checkbox"
                    checked={show}
                    onChange={() => setShow(!show)}
                  />
                  <span className="ml-2">
                    {name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                  </span>
                </label>
              </div>
            ))}
            <div className="border-t mt-2 pt-2">
              <h3 className="font-semibold text-lg">Edge Nodes</h3>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showStaticMarkers}
                    onChange={() => setShowStaticMarkers(!showStaticMarkers)}
                  />
                  <span className="ml-2">Markers</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};