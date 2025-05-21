"use client";

import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { CgClose } from "react-icons/cg";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const FishingSpotMap = ({ spot, setShow }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDG11FXeJ4CMV5nu2CK9HweOijPsPIcjPc",
  });

  const [map, setMap] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{ lat: spot.latitude, lng: spot.longitude }}
      zoom={12}
      onLoad={onLoad}
    >
      {/* Marker for the Fishing Spot */}
      <Marker
        position={{ lat: spot.latitude, lng: spot.longitude }}
        onClick={() => setSelectedSpot(spot)}
      />
      <span
        onClick={() => {
          setShow(false);
        }}
        className="p-1 rounded-full absolute top-2 right-2 z-20 bg-black/40 hover:bg-black/60 text-white cursor-pointer"
      >
        <CgClose className="text-[18px]" />
      </span>

      {/* Show tide data in InfoWindow when marker is clicked */}
      {selectedSpot && (
        <InfoWindow
          position={{ lat: spot.latitude, lng: spot.longitude }}
          onCloseClick={() => setSelectedSpot(null)}
          className="w-[20rem]"
        >
          <div className=" p-1 sm:p-4 bg-white rounded-lg shadow-lg w-[18rem]">
            <h3 className="text-lg font-semibold text-gray-800">{spot.name}</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Tide Data:</strong>
            </p>

            {spot?.tide && Array.isArray(spot.tide) && spot.tide.length > 0 ? (
              <ul className="space-y-2">
                {spot.tide.slice(0, 5).map((t, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 bg-blue-50 border border-blue-200 rounded-md"
                  >
                    <span className="text-gray-700 font-medium">
                      {t.dt
                        ? new Date(t.dt * 1000).toLocaleTimeString()
                        : "N/A"}
                    </span>
                    <span className="text-blue-600 font-semibold">
                      {t.height ? `${t.height}m` : "N/A"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tide data available</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default FishingSpotMap;
