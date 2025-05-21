"use client";

import Adminlayout from "@/app/components/Layout/Adminlayout";
import React, { useEffect, useMemo, useState } from "react";
import { IoAddOutline, IoCloseCircle, IoSearch } from "react-icons/io5";
import axios from "axios";
import SpotForm from "@/app/components/FishingSpot/SpotForm";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import dynamic from "next/dynamic";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import Loader from "@/app/utils/Loader";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
const FishingSpotMap = dynamic(
  () => import("../../../components/FishingSpot/SpotMapModal"),
  { ssr: false }
);
// import FishingSpotMap from "@/app/components/FishingSpot/SpotMapModal";

export default function FishingSpot() {
  const [searchValue, setSearchValue] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [spots, setSpots] = useState([]);
  const [position, setPosition] = useState([51.505, -0.09]);
  const [isShow, setIsShow] = useState(false);
  const [spotId, setSpotId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [spot, setSpot] = useState({});
  const [show, setShow] = useState(false);

  // Fishing Spots
  const fetchSpots = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/fishingSpot/all`
      );
      setSpots(data.spots);
    } catch (error) {
      console.error("Error fetching fishing spots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  // Function to handle search input
  const handleSearch = (value) => {
    setSearchValue(value);
  };

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
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/fishingSpot/delete/${id}`
      );
      if (data) {
        setSpots(spots.filter((spot) => spot._id !== id.toString()));
        toast.success("Fishing spot deleted successfully!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  // ----------------Pegination----------->
  const totalPages = Math.ceil(spots?.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get the current page data
  const paginatedData = spots?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        minSize: 50,
        maxSize: 220,
        size: 200,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Name</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          return (
            <div className="cursor-pointer text-[12px] text-black w-full  h-full flex items-center gap-1">
              <span
                onClick={() => {
                  setSpot(row.original);
                  setShow(true);
                }}
                className="text-[13px] text-blue-500 cursor-pointer font-medium truncate"
              >
                {row.original?.name}
              </span>
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "location",
        minSize: 50,
        maxSize: 220,
        size: 140,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Location</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          return (
            <div className="cursor-pointer text-[12px] text-black w-full  h-full flex items-center gap-1">
              <span className="text-[13px] text-black font-medium truncate">
                {row.original?.location}
              </span>
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "latitude",
        minSize: 50,
        maxSize: 220,
        size: 140,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Latitude</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          return (
            <div className="cursor-pointer text-[12px] text-black w-full  h-full flex items-center gap-1">
              <span className="text-[13px] text-black font-medium truncate">
                {row.original?.latitude}
              </span>
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "longitude",
        minSize: 50,
        maxSize: 220,
        size: 140,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Longitude</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          return (
            <div className="cursor-pointer text-[12px] text-black w-full  h-full flex items-center gap-1">
              <span className="text-[13px] text-black font-medium truncate">
                {row.original?.longitude}
              </span>
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "weather",
        minSize: 50,
        maxSize: 220,
        size: 200,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Weather</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          return (
            <div className="cursor-pointer text-[12px] text-black w-full  h-full flex items-center gap-1">
              <span className="text-[13px] text-black font-medium truncate">
                {row.original?.weather}
              </span>
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "description",
        minSize: 100,
        maxSize: 520,
        size: 360,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Description</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const description = row.original?.description;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {description}
            </div>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const cellValue =
            row.original[columnId]?.toString().toLowerCase() || "";

          return cellValue.includes(filterValue.toLowerCase());
        },
      },
      // {
      //   accessorKey: "tideChart",
      //   Header: "Tide Chart",
      //   size: 250,
      //   Cell: ({ row }) => {
      //     const tideData = row.original?.tide || [];

      //     const tideTimes = tideData.map((t) =>
      //       new Date(t.dt * 1000).toLocaleTimeString([], {
      //         hour: "2-digit",
      //         minute: "2-digit",
      //       })
      //     );
      //     const tideHeights = tideData.map((t) => t.height);

      //     const options = {
      //       chart: { type: "line", toolbar: { show: false } },
      //       xaxis: { categories: tideTimes },
      //       yaxis: { labels: { formatter: (val) => `${val}m` } },
      //       stroke: { curve: "smooth" },
      //       tooltip: { theme: "dark" },
      //     };

      //     const series = [
      //       { name: "Tide Height", data: tideHeights, color: "#1E90FF" },
      //     ];

      //     return (
      //       <div className="w-40 h-20">
      //         {tideData.length > 0 ? (
      //           <Chart
      //             options={options}
      //             series={series}
      //             type="line"
      //             height={70}
      //           />
      //         ) : (
      //           <span className="text-gray-500">No tide data</span>
      //         )}
      //       </div>
      //     );
      //   },
      // },

      {
        accessorKey: "Actions",
        minSize: 100,
        maxSize: 140,
        size: 130,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">ACTIONS</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const status = row.original.status;
          const [userStatus, setUserStatus] = useState(status);

          return (
            <div className="flex items-center justify-center gap-2 cursor-pointer text-[12px] text-black w-full h-full">
              <span
                onClick={() => {
                  setIsShow(true);
                  setSpotId(row.original._id);
                }}
                className="p-1 bg-sky-500 hover:bg-sky-600 rounded-full transition-all duration-300 hover:scale-[1.03]"
              >
                <MdModeEditOutline className="text-[16px] text-white" />
              </span>

              <span
                onClick={() => handleDeleteConfirmation(row.original._id)}
                className="p-1 bg-red-200 hover:bg-red-300   rounded-full transition-all duration-300 hover:scale-[1.03]"
              >
                <MdDelete className="text-[16px] text-red-500 hover:text-red-600" />
              </span>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spots]
  );

  const table = useMaterialReactTable({
    columns,
    data: paginatedData,
    getRowId: (row) => row._id,
    enableStickyHeader: true,
    enableStickyFooter: false,
    columnFilterDisplayMode: "popover",
    muiTableContainerProps: {
      sx: (theme) => ({
        minHeight: {
          xs: "330px",
          sm: "350px",
          md: "330px",
          lg: "400px",
          xl: "500px",
        },
        maxHeight: {
          xs: "350px",
          sm: "380px",
          md: "400px",
          lg: "500px",
          xl: "800px",
        },
      }),
    },

    enableColumnActions: false,
    enableColumnFilters: true,
    enableSorting: false,
    enableGlobalFilter: true,
    enableRowNumbers: false,
    enableColumnResizing: true,
    enableTopToolbar: true,
    enableBottomToolbar: false,
    enableRowSelection: true,
    // onRowSelectionChange: setRowSelection,
    // state: { rowSelection },
    // enableEditing: true,
    // state: { isLoading: isLoading },

    enablePagination: false,
    initialState: {
      pagination: { pageSize: 20 },
      pageSize: 20,
      density: "compact",
    },

    muiTableHeadCellProps: {
      style: {
        fontWeight: "600",
        fontSize: "12px",
        backgroundColor: "#f06b00",
        color: "#fff",
        padding: ".7rem 0.3rem",
      },
      // Override the icons (sorting, filtering) color to white
      sx: {
        "& .MuiTableSortLabel-icon": {
          color: "#fff",
        },
        "& .MuiSvgIcon-root": {
          color: "#fff",
        },
      },
    },

    muiTableColumnFilterProps: {
      style: {
        color: "#fff",
        backgroundColor: "#442622",
        border: "1px solid #fff",
      },
    },
  });

  return (
    <Adminlayout title={"Fishing Spot - PRLTA"}>
      <div className="relative w-full h-[100%] rounded-md flex flex-col gap-4 py-3 px-2 sm:px-4 bg-[#fff] overflow-hidden">
        {/* Header Section */}
        <div className="flex items-start justify-between flex-row gap-4">
          <div className="flex items-center gap-4 md:gap-[5rem]">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase font-sans">
              <span className="bg-gradient-to-r from-orange-600 to-gray-700 text-transparent bg-clip-text">
                Fishing Spot
              </span>
            </h1>

            {/* Search Input */}
            {/* <div className="relative hidden md:flex w-[13rem] sm:w-[15rem] rounded-lg h-[2.2rem] sm:h-[2.4rem] bg-gray-100 border border-gray-500">
              <span className="absolute right-2 top-[5px] z-30 text-gray-400 hover:text-customBrown p-1 hover:bg-gray-200 rounded-lg">
                <IoSearch className="h-5 w-5 cursor-pointer" />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full h-full border-none bg-transparent active:outline outline-customBrown rounded-lg pl-2 pr-5 text-[14px]"
              />
            </div> */}
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
        <div className="flex items-center justify-end w-full">
          <button
            onClick={() => setIsShow(true)}
            className={` min-w-[9rem] flex items-center justify-center gap-1 px-4 py-2 font-medium text-white rounded-md shadow-md transition-all transform bg-gradient-to-r from-orange-600 to-orange-500  hover:scale-[1.02] hover:shadow-md `}
          >
            <IoAddOutline className="h-5 w-5" /> Add New
          </button>
        </div>
        <hr className="w-full h-[1px] bg-gray-300" />
        <div className=" flex overflow-x-auto w-full h-[90%] overflow-y-auto mt-3 pb-4 ">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-screen px-4 py-4">
              <Loader />
            </div>
          ) : (
            <div className="w-full min-h-[20vh] relative">
              <div className="h-full overflow-y-scroll shidden relative">
                <MaterialReactTable table={table} />
              </div>
            </div>
          )}
        </div>

        {/* ----------------Handle Modals--------------- */}
        {isShow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-2 sm:p-4 bg-white/75 bg-blend-luminosity ">
            <div className="w-[38rem]">
              <SpotForm
                setIsShow={setIsShow}
                spotId={spotId}
                setSpotId={setSpotId}
                fetchSpots={fetchSpots}
              />
            </div>
          </div>
        )}

        {/* ----------------Handle Modals--------------- */}
        {show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-2 sm:p-4 bg-white/75 bg-blend-luminosity ">
            <div className="w-[40rem] rounded-md border-orange-600 border-2 bg-white overflow-hidden shadow-md">
              <FishingSpotMap spot={spot} setShow={setShow} />
            </div>
          </div>
        )}
      </div>
    </Adminlayout>
  );
}
