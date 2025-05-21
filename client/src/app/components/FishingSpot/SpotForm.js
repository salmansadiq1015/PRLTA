"use client";
import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function SpotForm({ setIsShow, spotId, setSpotId, fetchSpots }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const fetchData = async () => {
    if (!spotId) return;
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/fishingSpot/single/${spotId}`
      );
      setName(data.spot.name);
      setLatitude(data.spot.latitude);
      setLongitude(data.spot.longitude);
      setDescription(data.spot.description);
      setLocation(data.spot.location);
    } catch (error) {
      console.error("Error fetching fishing spots:", error);
    }
  };

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotId]);

  // Function to fetch GPS coordinates based on location
  const fetchCoordinates = async (place) => {
    if (!place) return;
    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
      );
      if (data.length > 0) {
        setLatitude(data[0].lat);
        setLongitude(data[0].lon);
        toast.success("Location coordinates fetched!");
      } else {
        toast.error("No location found!");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      toast.error("Failed to fetch location.");
    }
  };

  // Call API after user stops typing
  useEffect(() => {
    if (location) {
      clearTimeout(typingTimeout);
      const timeout = setTimeout(() => {
        fetchCoordinates(location);
      }, 800);
      setTypingTimeout(timeout);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!spotId) {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/fishingSpot/add`,
          { name, latitude, longitude, description, location }
        );
        if (data) {
          fetchSpots();
          toast.success("Fishing spot added successfully!");
          setSpotId("");
          setIsShow(false);
          setName("");
          setLatitude("");
          setLongitude("");
          setDescription("");
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Error adding fishing spot"
        );
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/fishingSpot/update/${spotId}`,
          { name, latitude, longitude, description, location }
        );
        if (data) {
          fetchSpots();
          toast.success("Fishing spot updated successfully!");
          setSpotId("");
          setIsShow(false);
          setName("");
          setLatitude("");
          setLongitude("");
          setDescription("");
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message || "Error updating fishing spot"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-md overflow-hidden shadow h-[99%] flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between bg-customOrange px-4 py-2 sm:py-3">
        <h3 className="text-lg font-semibold text-white">
          {spotId ? "Edit Fishing Spot" : "Add Fishing Spot"}
        </h3>
        <span
          onClick={() => {
            setSpotId("");
            setIsShow(false);
          }}
          className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer"
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 px-4 py-2 mt-4 w-full max-h-[28rem] sm:max-h-[32rem] overflow-y-auto"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Name<span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Spot Name"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Location<span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Location"
              required
            />
          </div>

          {/* <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Latitude<span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Latitude"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Longitude<span className="text-red-700">*</span>
            </label>
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Longitude"
              required
            />
          </div> */}

          <div className="flex flex-col col-span-2 w-full gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${Style.input} w-full h-[6rem]`}
              placeholder="Description"
            />
          </div>
        </div>

        <div className="flex items-center justify-end w-full pb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSpotId("");
                setIsShow(false);
              }}
              type="button"
              className="w-[6rem] py-[.3rem] text-[14px] rounded-sm border-2 border-red-600 text-red-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.03] transition-all duration-300"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="w-[6rem] py-[.4rem] text-[14px] flex items-center justify-center rounded-sm bg-customOrange hover:shadow-md hover:scale-[1.03] transition-all duration-300 text-white"
            >
              {loading ? (
                <FaSpinner className="h-5 w-5 text-white animate-spin" />
              ) : (
                <span>{spotId ? "Save" : "SUBMIT"}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
