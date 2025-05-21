"use client";
import CatchesModal from "@/app/components/Catches/CatchesModal";
import Adminlayout from "@/app/components/Layout/Adminlayout";
import Loader from "@/app/utils/Loader";
import axios from "axios";
import { format, set } from "date-fns";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { IoAddOutline, IoCloseCircle, IoSearch } from "react-icons/io5";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import Swal from "sweetalert2";

const categoryOptions = [
  "All",
  "Inshore",
  "Offshore",
  // "Freshwater",
  // "Saltwater",
  // "Small Bait",
  // "Predatory",
  // "Tropical",
  // "Coldwater",
  // "Pelagic",
  // "Deep-Sea",
  "Domestic",
  "International",
];

export default function Catches() {
  const [catchesData, setCatchesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCatches, setFilterCatches] = useState([]);
  const initialLoad = useRef(true);
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [catchesId, setCatchesId] = useState("");
  const [isCatch, setIsCatch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get All Catches
  const fetchData = async () => {
    if (initialLoad.current) {
      setLoading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/catches/all/catch`
      );

      if (data) {
        setCatchesData(data.catches);
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
    setFilterCatches(catchesData);
  }, [catchesData]);

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    filterData(value);
  };

  // -------------Handle filtering by tabs and search---------------
  const filterData = (search = searchValue, tab = selectedCategory) => {
    let filtered = catchesData;

    if (tab === "All") {
      filtered = catchesData;
    } else {
      filtered = catchesData.filter(
        (catches) =>
          catches.category.trim().toLowerCase() === tab.trim().toLowerCase() ||
          catches.shore.trim().toLowerCase() === tab.trim().toLowerCase()
      );
    }

    if (search) {
      const lowercasedSearch = search.toLowerCase();

      filtered = filtered.filter((catches) => {
        const {
          name = "",
          email = "",
          vessel_Name = "",
          location = "",
          fisherman = "",
          vessel_Owned = "",
          shore = "",
          category = "",
          tournament_name = "",
          specie = "",
          line_strenght = "",
          fish_width = "",
          fish_length = "",
          score = "",
          rank = "",
        } = catches;

        return (
          name.toLowerCase().includes(lowercasedSearch) ||
          email.toLowerCase().includes(lowercasedSearch) ||
          vessel_Name.toLowerCase().includes(lowercasedSearch) ||
          location.toLowerCase().includes(lowercasedSearch) ||
          fisherman.toLowerCase().includes(lowercasedSearch) ||
          vessel_Owned.toLowerCase().includes(lowercasedSearch) ||
          shore.toLowerCase().includes(lowercasedSearch) ||
          category.toLowerCase().includes(lowercasedSearch) ||
          tournament_name.toLowerCase().includes(lowercasedSearch) ||
          specie.toLowerCase().includes(lowercasedSearch) ||
          line_strenght.toLowerCase().includes(lowercasedSearch) ||
          fish_width.toLowerCase().includes(lowercasedSearch) ||
          fish_length.toLowerCase().includes(lowercasedSearch) ||
          score.toLowerCase().includes(lowercasedSearch) ||
          rank.toLowerCase().includes(lowercasedSearch)
        );
      });
    }

    setFilterCatches(filtered);
  };

  const handleTabClick = (tab) => {
    setSelectedCategory(tab);
    filterData(searchValue, tab);
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
        handleDeleteUser(id);
      }
    });
  };

  const handleDeleteUser = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/catches/delete/catch/${id}`
      );
      if (data) {
        setFilterCatches(
          filterCatches.filter((cat) => cat._id !== id.toString())
        );
        toast.success("Catch deleted successfully!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  // Handle Delete All Catches
  const handleDeleteAllConfirmation = () => {
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
        handleDeleteAllCatches();
      }
    });
  };

  const handleDeleteAllCatches = async () => {
    if (!rowSelection) {
      return toast.error("Please select at least one catch to delete.");
    }

    const catchIds = Object.keys(rowSelection);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/catches/delete/all/catch`,
        { catchIds: catchIds }
      );

      toast.success("All selected catches deleted successfully!");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  // ----------------Pegination----------->
  const totalPages = Math.ceil(filterCatches?.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get the current page data
  const paginatedData = filterCatches?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        minSize: 50,
        maxSize: 220,
        size: 220,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Project</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const thumbnails = useMemo(
            () => row.original?.images || [],
            [row.original?.images]
          );
          const [currentIndex, setCurrentIndex] = useState(0);

          useEffect(() => {
            if (thumbnails.length > 1) {
              const interval = setInterval(() => {
                setCurrentIndex(
                  (prevIndex) => (prevIndex + 1) % thumbnails.length
                );
              }, 5000);

              return () => clearInterval(interval);
            }
          }, [thumbnails]);

          const currentThumbnail = thumbnails[currentIndex];

          return (
            <div className="cursor-pointer text-[12px] text-black w-full h-full flex items-center gap-1">
              <div className="w-[4rem] h-[2.2rem] relative rounded-md bg-sky-600 overflow-hidden flex items-center justify-center">
                {currentThumbnail ? (
                  <Image
                    src={currentThumbnail}
                    layout="fill"
                    alt={"thumbnail"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <h3 className="text-[18px] font-medium text-white uppercase">
                    {row.original?.name?.slice(0, 1)}
                  </h3>
                )}
              </div>
              <span className="text-[13px] text-black font-medium truncate">
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
        accessorKey: "email",
        minSize: 100,
        maxSize: 520,
        size: 220,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Email</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const email = row.original?.email;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {email}
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
        accessorKey: "vessel_Name",
        minSize: 60,
        maxSize: 160,
        size: 160,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Vessel Name</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const vessel_Name = row.original?.vessel_Name;

          return (
            <div className="flex items-center justify-start truncate cursor-pointer text-[13px] text-black w-full h-full">
              {vessel_Name ? vessel_Name : ""}
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
        minSize: 60,
        maxSize: 150,
        size: 150,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer truncate">Location</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const location = row.original?.location;

          return (
            <div className="flex items-center justify-start truncate cursor-pointer text-[13px] text-black w-full h-full">
              {location ? location : ""}
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
        minSize: 60,
        maxSize: 100,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer truncate">Latitude</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const latitude = row.original?.latitude;

          return (
            <div className="flex items-center justify-start truncate cursor-pointer text-[13px] text-black w-full h-full">
              {latitude ? latitude : ""}
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
        minSize: 60,
        maxSize: 100,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer truncate">Longitude</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const longitude = row.original?.longitude;

          return (
            <div className="flex items-center justify-start truncate cursor-pointer text-[13px] text-black w-full h-full">
              {longitude ? longitude : ""}
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
        accessorKey: "fisherman",
        minSize: 100,
        maxSize: 180,
        size: 170,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer truncate">Fisherman</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const fisherman = row.original?.fisherman;

          return (
            <div className="flex items-center justify-start  cursor-pointer text-[13px] text-black w-full h-full truncate">
              {fisherman ? fisherman : ""}
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
        accessorKey: "vessel_Owned",
        minSize: 60,
        maxSize: 200,
        size: 140,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer truncate">Vessel Owned</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const vessel_Owned = row.original?.vessel_Owned;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {vessel_Owned}
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
        accessorKey: "shore",
        minSize: 60,
        maxSize: 150,
        size: 150,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Shore</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const shore = row.original?.shore;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {shore}
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
        accessorKey: "category",
        minSize: 60,
        maxSize: 150,
        size: 150,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Category</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const category = row.original?.category;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {category}
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
        accessorKey: "tournament_name",
        minSize: 60,
        maxSize: 200,
        size: 180,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Tournament Name</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const tournament_name = row.original?.tournament_name;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {tournament_name}
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
        accessorKey: "Date",
        minSize: 60,
        maxSize: 200,
        size: 150,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Date</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const date = row.original?.date;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {format(date || new Date(), "dd/MM/yyyy - HH:mm a")}
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
        accessorKey: "specie",
        minSize: 60,
        maxSize: 200,
        size: 180,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Specie</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const specie = row.original?.specie;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {specie}
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
        accessorKey: "line_strenght",
        minSize: 60,
        maxSize: 200,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Line Strenght</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const line_strenght = row.original?.line_strenght;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {line_strenght} Ibs
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
        accessorKey: "fish_length",
        minSize: 60,
        maxSize: 200,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Fish Length</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const fish_length = row.original?.fish_length;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {fish_length} Inch
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
        accessorKey: "fish_width",
        minSize: 60,
        maxSize: 200,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Fish Width</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const fish_width = row.original?.fish_width;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {fish_width} Inch
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
        accessorKey: "score",
        minSize: 60,
        maxSize: 200,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Catch Score</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const score = row.original?.score;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {score} Points
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
        accessorKey: "rank",
        minSize: 60,
        maxSize: 200,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer ">Catch Rank</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const rank = row.original?.rank;
          const formatRank = (rank) => {
            const num = parseInt(rank.toString());
            if (isNaN(num)) return "";

            const suffix =
              num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";

            return `${num}${suffix}`;
          };

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {formatRank(rank)}
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
        accessorKey: "status",
        minSize: 70,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Status</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const status = cell.getValue();
          const [catchStatus, setCatchStatus] = useState(status);
          const [show, setShow] = useState(false);

          const handleUpdate = async (value) => {
            setCatchStatus(value);
            try {
              const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/catches/update/status/${row.original._id}`,
                {
                  status: value,
                }
              );
              if (data) {
                setFilterCatches((prev) =>
                  prev.map((item) =>
                    item._id === row.original._id ? data.catches : item
                  )
                );
                fetchData();
                toast.success("Status updated");
              }
            } catch (error) {
              console.log(error);
              toast.error(error.response?.data?.message);
            } finally {
              setShow(false);
            }
          };

          return (
            <div className="w-full h-full">
              {!show ? (
                <div
                  onDoubleClick={() => setShow(true)}
                  className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full"
                >
                  {status === "pending" ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-sky-600 bg-sky-200 hover:bg-sky-300 text-sky-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Pending
                    </button>
                  ) : status === "approved" ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-green-600 bg-green-200 hover:bg-green-300 text-green-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Approved
                    </button>
                  ) : (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-red-600 bg-red-200 hover:bg-red-300 text-red-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Rejected
                    </button>
                  )}
                </div>
              ) : (
                <select
                  value={catchStatus}
                  onChange={(e) => handleUpdate(e.target.value)}
                  onBlur={() => setShow(false)}
                  className="w-full border rounded-md p-1 text-black text-[14px]"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              )}
            </div>
          );
        },
        // filterVariant: "select",
        // filterSelectOptions: ["pending", "approved", "rejected"],
      },
      {
        accessorKey: "featured",
        minSize: 70,
        maxSize: 140,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Featured</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const featured = cell.getValue();
          const [userRole, setUserRole] = useState(featured);
          const [show, setShow] = useState(false);

          useEffect(() => {
            setUserRole(row.original.featured);
          }, [row.original.featured]);

          const handleUpdate = async (value) => {
            setUserRole(value);
            try {
              const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/catches/update/status/${row.original._id}`,
                {
                  featured: value,
                }
              );
              if (data) {
                setFilterCatches((prev) =>
                  prev.map((item) =>
                    item._id === row.original._id ? data.catches : item
                  )
                );
                fetchData();
                toast.success("Feature updated");
              }
            } catch (error) {
              console.log(error);
              toast.error(error.response?.data?.message);
            } finally {
              setShow(false);
            }
          };

          return (
            <div className="w-full h-full">
              {!show ? (
                <div
                  onDoubleClick={() => setShow(true)}
                  className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full"
                >
                  {userRole === true ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-green-600 bg-green-500 hover:bg-green-600 text-white hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Highlighted
                    </button>
                  ) : (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-red-600 bg-red-600 hover:bg-red-600 text-white hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Notable
                    </button>
                  )}
                </div>
              ) : (
                <select
                  value={userRole}
                  onChange={(e) => handleUpdate(e.target.value)}
                  onBlur={() => setShow(false)}
                  className="w-full border rounded-md p-1 text-black text-[14px]"
                >
                  <option value="true">Highlighted</option>
                  <option value="false">Notable</option>
                </select>
              )}
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

          const handleUpdate = async (value) => {
            setUserStatus(value);
            alert(value);
            try {
              const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/update/role/${row.original._id}`,
                { status: value }
              );
              if (data) {
                fetchUsers();
              }
            } catch (error) {
              console.log(error);
              toast.error(error.response?.data?.message);
            }
          };
          return (
            <div className="flex items-center justify-center gap-2 cursor-pointer text-[12px] text-black w-full h-full">
              <span
                onClick={() => {
                  setIsCatch(true);
                  setCatchesId(row.original._id);
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
    [catchesData, filterCatches]
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
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
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
    <Adminlayout title="Catches - PRLTA">
      <div className="w-full h-[100%] rounded-md flex flex-col gap-4 py-3 px-2 sm:px-4 bg-[#fff] overflow-hidden">
        <div className="flex items-start sm:items-end justify-between flex-col md:flex-row gap-4 ">
          <div className="flex items-center gap-4 md:gap-[5rem]">
            <h1 className="text-xl sm:text-2xl   font-bold text-gray-900 uppercase font-sans ">
              <span className="bg-gradient-to-r from-orange-600 to-gray-700 text-transparent bg-clip-text">
                Catches
              </span>
            </h1>

            <div className="relative w-[13rem] sm:w-[15rem] rounded-lg h-[2.2rem] sm:h-[2.4rem] bg-gray-100 border border-gray-500 ">
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
        {/* Type of users */}
        <div className="w-full flex items-start justify-between flex-col md:flex-row gap-4">
          <div className="w-full overflow-x-auto flex items-center gap-2 py-1 px-1 sm:px-0 sm:py-0 shidden">
            {categoryOptions.map((category, index) => (
              <div
                key={index}
                className={`flex items-center min-w-fit gap-2 cursor-pointer rounded-md px-5 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 ${
                  category === selectedCategory
                    ? "bg-gray-100 border-2 border-orange-600 text-orange-600"
                    : "border-2"
                }`}
                onClick={() => handleTabClick(category)}
              >
                {category}
              </div>
            ))}
          </div>
          {/*  */}
          <div className="flex items-center w-full md:w-fit justify-end gap-5 ">
            <span
              disabled={Object.keys(rowSelection).length === 0}
              onClick={() => handleDeleteAllConfirmation()}
            >
              <AiFillDelete
                className={`h-5 w-5 cursor-pointer transition-all duration-300 ease-in-out ${
                  Object.keys(rowSelection).length > 0
                    ? "text-red-500 hover:text-red-600"
                    : "text-customBrown cursor-not-allowed"
                }`}
              />
            </span>
            <button
              onClick={() => setIsCatch(true)}
              className={` min-w-[9rem] flex items-center justify-center gap-1 px-4 py-2 font-medium text-white rounded-md shadow-md transition-all transform bg-gradient-to-r from-orange-600 to-orange-500  hover:scale-[1.02] hover:shadow-md `}
            >
              <IoAddOutline className="h-5 w-5" /> Add New
            </button>
          </div>
        </div>
        <div className=" flex overflow-x-auto w-full h-[90%] overflow-y-auto mt-3 pb-4 ">
          {loading ? (
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
        {isCatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-2 sm:p-4 bg-white/75 bg-blend-luminosity ">
            <div className="w-[38rem]">
              <CatchesModal
                setIsCatch={setIsCatch}
                catchesId={catchesId}
                setCatchesId={setCatchesId}
                fetchData={fetchData}
              />
            </div>
          </div>
        )}
      </div>
    </Adminlayout>
  );
}
