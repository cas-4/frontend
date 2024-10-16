import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
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
  query lastPositions {
    lastPositions {
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

  const { loading, error, data } = useQuery<{ lastPositions: LastPosition[] }>(LAST_POSITION_QUERY);
  const position: LatLngExpression = [44.49381, 11.33875]; // Bologna

  const goToLogout = () => {
    navigate('/logout');
  };
  
  const markerIcon = new Icon({
    iconUrl: markerIconSvg,
    iconSize: [30, 30],
    className: 'marker-icon'
  });

  const nodeIcon = new Icon({
    iconUrl: nodeSvg,
    iconSize: [30,30],
    className: 'node-icon'
  })

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

  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'IN_VEHICLE',
    'RUNNING',
    'WALKING',
    'STILL',
  ]);

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error loading last positions:", error);
    navigate('/error');
    return null;
  }

  const filteredPositions = data?.lastPositions.filter((position) =>
    selectedActivities.includes(position.movingActivity)
  );

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
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
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
                        'rounded-md px-3 py-2 text-sm font-medium',
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

                <MenuItems
                  className="absolute right-0 z-10000 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`block px-4 py-2 text-sm text-gray-700 ${
                          active ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => navigate('/settings')}
                      >
                        Settings
                      </a>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`block px-4 py-2 text-sm text-gray-700 ${
                          active ? 'bg-gray-100' : ''
                        }`}
                        onClick={goToLogout}
                      >
                        Logout
                      </a>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* Mobile Navigation Links */}
          </div>
        </DisclosurePanel>
      </Disclosure>

      <div className="relative flex flex-col justify-center items-center flex-grow bg-gray-100">
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-md z-50">
          <h2 className="text-xl font-bold mb-4">Filter by Activity</h2>
          <div className="flex space-x-4 flex-wrap">
            {['IN_VEHICLE', 'RUNNING', 'WALKING', 'STILL'].map((activity) => (
              <label key={activity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity)}
                  onChange={() => toggleActivity(activity)}
                />
                <span>{activity}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-full w-full">
          <MapContainer center={position} zoom={14} className="h-full w-full z-0">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredPositions?.map((position) => (
              <Marker key={position.id} position={[position.latitude, position.longitude]} icon={markerIcon}>
                <Popup>
                  {`User ID: ${position.userId}`}<br />
                  {`Activity: ${position.movingActivity}`}<br />
                  {`Time: ${new Date(position.createdAt).toLocaleString()}`}
                </Popup>
              </Marker>
            ))}
            {staticMarkers.map((marker, index) => (
              <Marker key={index} position={marker.geocode} icon={nodeIcon}>
                <Popup>{marker.popUp}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}