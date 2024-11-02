import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'; // Import DisclosurePanel
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import markerIconSvg from '../assets/marker.svg';
import nodeSvg from '../assets/node.svg';

const USER_NAME_QUERY = gql`
  query getUserName($userId: ID!) {
    user(id: $userId) {
      name
    }
  }
`;

const LAST_POSITION_QUERY = gql`
  query positions {
    positions {
      id
      userId
      createdAt
      latitude
      longitude
      movingActivity
    }
  }
`;

interface User {
  name: string;
}

interface LastPosition {
  id: string;
  userId: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  movingActivity: string;
}

export default function Dashboard() {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  // Fetch the user's name
  const { data: userData } = useQuery<{ user: User }>(USER_NAME_QUERY, {
    variables: { userId: parseInt(userId || "0") },
  });

  const { error, data } = useQuery<{ positions: LastPosition[] }>(LAST_POSITION_QUERY);
  const position: LatLngExpression = [44.49381, 11.33875]; // Bologna

  // List of activity types and their visibility states
  const activityTypes = [
    { name: 'STILL', show: useState(true) },
    { name: 'WALKING', show: useState(true) },
    { name: 'RUNNING', show: useState(true) },
    { name: 'IN_VEHICLE', show: useState(true) }
  ];

  const [showStaticMarkers, setShowStaticMarkers] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const markerIcon = new Icon({
    iconUrl: markerIconSvg,
    iconSize: [30, 30],
    className: 'marker-icon'
  });

  const nodeIcon = new Icon({
    iconUrl: nodeSvg,
    iconSize: [30, 30],
    className: 'node-icon'
  });

  const staticMarkers = [
    {
      geocode: [44.4970183, 11.3562014] as LatLngExpression,
      popUp: 'Dipartimento di Informatica - Scienze e Ingegneria',
    },
    {
      geocode: [44.4943, 11.3465] as LatLngExpression,
      popUp: 'Towers of Bologna',
    },
  ];

  const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  if (error) {
    navigate('/error');
    return null;
  }

  const userName = userData?.user.name || 'User';
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-screen">
      <Disclosure as="nav" className="bg-gray-800 w-full">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img alt="CAS" src="./CAS.png" className="h-8 w-auto" />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold h-10 w-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  {userInitials}
                  <span className="sr-only">Open user settings</span>
                      </MenuButton>
              </div>

                    <MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem 
                        as="a" 
                        href="#" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                        onClick={() => navigate('/settings')}
                      >
                        Settings
                      </MenuItem>
                      <MenuItem 
                        as="a" 
                        href="#" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                        onClick={() => navigate('/logout')}
                      >
                        Logout
                      </MenuItem>
                    </MenuItems>
                  </Menu>
            </div>
          </div>
        </div>

        {/* Mobile navigation options */}
        <DisclosurePanel className="sm:hidden">
          <div className="flex flex-col space-y-2 p-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-sm font-medium'
                )}
              >
                {item.name}
              </a>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>

      <div className="relative flex flex-col justify-center items-center flex-grow bg-gray-100">
        <MapContainer center={position} zoom={14} className="w-full h-full relative z-0">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          {data?.positions.map(({ userId, latitude, longitude, movingActivity, createdAt }) => {
            const timestamp = parseInt(createdAt) * 1000;

            return (
              activityTypes.find(({ name }) => name === movingActivity)?.show[0] ? (
                <Marker key={userId} position={[latitude, longitude]} icon={markerIcon}>
                  <Popup>
                    {`User ID: ${userId}`}<br />
                    {`Activity: ${movingActivity}`}<br />
                    {`Time: ${timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}`}
                  </Popup>
                </Marker>
              ) : null
            );
          })}
          {showStaticMarkers && staticMarkers.map(({ geocode, popUp }) => (
            <Marker key={popUp} position={geocode} icon={nodeIcon}>
              <Popup>{popUp}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Clickable button over the map */}
        <div className="flex flex-col items-end absolute top-4 right-4 z-10">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown visibility
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-500 focus:outline-none w-32" // Added w-32 for fixed width
          >
            Filters
          </button>
          {dropdownOpen && ( // Conditional rendering of the dropdown menu
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
                      <span className="ml-2">{name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
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
      </div>

    </div>
  );
}
