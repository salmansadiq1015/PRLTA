"use client";
import Adminlayout from "@/app/components/Layout/Adminlayout";
import Loader from "@/app/utils/Loader";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { IoAddOutline, IoCloseCircle, IoSearch } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { FiTrash2 } from "react-icons/fi";
import GalleryModal from "@/app/components/Gallery/GalleryModal";
import Swal from "sweetalert2";

export default function Gallery() {
  const [galleryData, setGalleryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const initialLoad = useRef(true);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [galleryId, setGalleryId] = useState("");

  const fetchData = async () => {
    if (initialLoad.current) {
      setLoading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/gallery/allGallery`
      );

      console.log("data: ", data);

      if (data) {
        setGalleryData(data.gallery);
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (initialLoad.current) {
        setLoading(false);
        initialLoad.current = false;
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(galleryData);
  }, [galleryData]);

  // Handle Search
  const handleSearch = (value) => {
    setSearchValue(value);
    console.log("value: ", value);
    if (!galleryData) return;

    const filterData = galleryData.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filterData);
  };

  // ----------------Pegination----------->
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get the current page data
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("paginatedData: ", paginatedData);

  // Handle Delete User
  const handleDeleteConfirmation = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/gallery/delete/gallery/image/${id}`
      );
      if (data) {
        setFilteredData(
          filteredData.filter((image) => image._id !== id.toString())
        );
        toast.success("Image deleted successfully!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Adminlayout title="Gallery - PRLTA">
      <div className="relativew-full h-[100%] rounded-md flex flex-col gap-4 py-3 px-2 sm:px-4 bg-[#fff] overflow-hidden">
        <div className="flex items-start justify-between  flex-row gap-4 ">
          <div className="flex items-center gap-4 md:gap-[5rem]">
            <h1 className="text-xl sm:text-2xl   font-bold text-gray-900 uppercase font-sans ">
              <span className="bg-gradient-to-r from-orange-600 to-gray-700 text-transparent bg-clip-text">
                Gallery
              </span>
            </h1>

            <div className="relative  hidden md:flex w-[13rem] sm:w-[15rem] rounded-lg h-[2.2rem] sm:h-[2.4rem] bg-gray-100 border border-gray-500 ">
              <span className="absolute right-2 top-[5px] z-30 text-gray-400 hover:text-customBrown p-1 hover:bg-gray-200 rounded-lg ">
                <IoSearch className="h-5 w-5 cursor-pointer" />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full h-full border-none bg-transparent active:outline outline-customBrown rounded-lg pl-2 pr-5 text-[14px]"
              />
            </div>
          </div>
          {/* Pegination */}
          <div className="w-full md:w-fit flex items-center justify-end  ">
            <div className="flex items-center gap-3 justify-end sm:justify-normal w-full sm:w-fit">
              <span>
                {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <CiCircleChevLeft
                  onClick={() => handlePageChange("prev")}
                  className={`text-[27px] text-red-500 hover:text-red-600 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                />
                <CiCircleChevRight
                  onClick={() => handlePageChange("next")}
                  className={`text-[27px] text-red-500 hover:text-red-600 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                />
              </div>
              <span>
                <IoCloseCircle
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  size={25}
                  className={` text-red-500 hover:text-red-600 transition-all duration-300 ${
                    currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                />
              </span>
            </div>
          </div>
        </div>
        <hr className="w-full h-[1px] bg-gray-300" />
        <div className=" fixed bottom-2 right-2 z-10">
          <div className="flex items-center w-full md:w-fit justify-end gap-5 ">
            <button
              onClick={() => setIsShow(true)}
              className={`w-[3rem] h-[3rem] rounded-full flex hover:rotate-[180deg] duration-300 items-center justify-center font-medium text-white shadow-md transition-all transform bg-gradient-to-r from-orange-600 to-orange-500  hover:scale-[1.02] hover:shadow-md `}
            >
              <IoAddOutline size={30} />
            </button>
          </div>
        </div>
        {/*  ----------------Gallery Data--------------- */}
        <div className="w-full h-full overflow-y-auto bg-[#fff] overflow-hidden">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4  gap-4 py-3 px-2 sm:px-4">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden bg-gray-800 animate-pulse"
                >
                  <div className="w-full h-72 sm:h-80 md:h-96 bg-gray-700 rounded-xl"></div>
                  <div className="absolute bottom-5 left-5 w-3/4 h-5 bg-gray-600 rounded-md"></div>
                  <div className="absolute bottom-2 left-5 w-1/2 h-3 bg-gray-500 rounded-md"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4  gap-4 py-3 px-2 sm:px-4">
              {paginatedData?.map((gallery) => (
                <div
                  key={gallery._id}
                  className="relative rounded-xl overflow-hidden group hover:shadow-md transition-all duration-500 shadow-gray-300"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden">
                    <Image
                      src={gallery?.image}
                      layout="fill"
                      objectFit="fill"
                      className="transition-transform duration-500 ease-in-out group-hover:scale-110"
                      alt={gallery.title}
                    />
                  </div>

                  {/* Overlay & Details */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60 group-hover:opacity-80 transition-all duration-500"></div>

                  {/* Title & Views */}
                  <div className="absolute flex items-center justify-between gap-2 bottom-5 left-5 right-5 text-white">
                    <h3 className="text-[18px] sm:text-lg font-medium truncate">
                      {gallery.title}
                    </h3>
                    <p className="text-sm opacity-80 flex items-center flex-row gap-1">
                      <IoEye className="text-white" size={22} /> (
                      {gallery.views})
                    </p>
                  </div>

                  {/* Edit & Delete Icons */}
                  <div className="absolute top-3 right-3 flex gap-2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => {
                        setGalleryId(gallery._id);
                        setIsShow(true);
                      }}
                      className="p-2 bg-white text-gray-800 rounded-full shadow-md hover:bg-gray-200"
                    >
                      <CiEdit size={20} />
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteConfirmation(gallery._id);
                      }}
                      className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------------Modals-------------------- */}
        {isShow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-2 sm:p-4 bg-white/75 bg-blend-luminosity ">
            <div className="w-[30rem]">
              <GalleryModal
                setIsShow={setIsShow}
                galleryId={galleryId}
                setGalleryId={setGalleryId}
                fetchData={fetchData}
              />
            </div>
          </div>
        )}
      </div>
    </Adminlayout>
  );
}
