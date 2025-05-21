// ----------------------

"use client";
import CatchesModal from "@/app/components/Catches/CatchesModal";
import EventModal from "@/app/components/Events/EventModal";
import Adminlayout from "@/app/components/Layout/Adminlayout";
import Loader from "@/app/utils/Loader";
import axios from "axios";
import { format } from "date-fns";
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

const types = ["All", "Upcoming", "Ongoing", "Completed"];

export default function Events() {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterEvents, setFilterEvents] = useState([]);
  const initialLoad = useRef(true);
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [eventId, setEventId] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedType, setSelectedType] = useState("All");

  console.log("eventsData:", eventsData);

  // Get All Catches
  const fetchData = async () => {
    if (initialLoad.current) {
      setLoading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/allEvents`
      );

      if (data) {
        setEventsData(data.events);
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
    setFilterEvents(eventsData);
  }, [eventsData]);

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    filterData(value);
  };

  // -------------Handle filtering by tabs and search---------------
  const filterData = (search = searchValue, type = selectedType) => {
    let filtered = eventsData;

    if (type === "All") {
      filtered = eventsData;
    } else if (type === "Upcoming") {
      filtered = eventsData.filter((event) => event.status === "upcoming");
    } else if (type === "Ongoing") {
      filtered = eventsData.filter((event) => event.status === "ongoing");
    } else if (type === "Completed") {
      filtered = eventsData.filter((event) => event.status === "completed");
    }

    if (search) {
      const lowercasedSearch = search.toLowerCase();

      filtered = filtered.filter((events) => {
        const { title = "" } = events;

        return title.toLowerCase().includes(lowercasedSearch);
      });
    }

    setFilterEvents(filtered);
  };

  const handleTabClick = (tab) => {
    setSelectedType(tab);
    filterData(searchValue, tab);
  };

  // Handle Delete Event
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
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/deleteEvent/${id}`
      );
      if (data) {
        setFilterEvents(
          filterEvents.filter((cat) => cat._id !== id.toString())
        );
        toast.success("Event deleted successfully!");
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
        handleDeleteAllEvents();
      }
    });
  };

  const handleDeleteAllEvents = async () => {
    if (!rowSelection) {
      return toast.error("Please select at least one catch to delete.");
    }

    const eventIds = Object.keys(rowSelection);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/deleteMultipleEvents`,
        { ids: eventIds }
      );

      toast.success("All selected events deleted successfully!");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  // ----------------Pegination----------->
  const totalPages = Math.ceil(filterEvents?.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get the current page data
  const paginatedData = filterEvents?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "image",
        minSize: 50,
        maxSize: 220,
        size: 110,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Image</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const image = row.original.image;

          return (
            <div className="cursor-pointer text-[12px] text-black w-full h-full flex items-center gap-1">
              <div className="w-[4.5rem] h-[3rem] relative rounded-md bg-sky-600 overflow-hidden flex items-center justify-center">
                <Image
                  src={image}
                  layout="fill"
                  alt={"thumbnail"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "title",
        minSize: 50,
        maxSize: 220,
        size: 200,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Title</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          return (
            <div className="cursor-pointer text-[12px] text-black w-full  h-full flex items-center gap-1">
              <span className="text-[13px] text-black font-medium truncate">
                {row.original?.title}
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
        size: 460,
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
      {
        accessorKey: "startDate",
        minSize: 60,
        maxSize: 160,
        size: 160,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Start Date</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const startDate = row.original?.startDate;

          return (
            <div className="flex items-center justify-start truncate cursor-pointer text-[13px] text-black w-full h-full">
              {format(startDate || new Date(), "dd/MM/yyyy - HH:mm a")}
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
        accessorKey: "endDate",
        minSize: 60,
        maxSize: 160,
        size: 160,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">End Date</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const endDate = row.original?.endDate;

          return (
            <div className="flex items-center justify-start truncate cursor-pointer text-[13px] text-black w-full h-full">
              {format(endDate || new Date(), "dd/MM/yyyy - HH:mm a")}
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
        accessorKey: "isUpcoming",
        minSize: 60,
        maxSize: 150,
        size: 150,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer truncate">Is Upcoming</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const isUpcoming = row.original?.isUpcoming;

          return (
            <div
              className={`flex items-center justify-start truncate ${
                isUpcoming ? "text-green-500" : "text-red-500"
              } cursor-pointer text-[13px] text-black w-full h-full`}
            >
              {isUpcoming ? "Upcoming" : "Completed"}
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
      //   accessorKey: "participants",
      //   minSize: 60,
      //   maxSize: 200,
      //   size: 140,
      //   grow: false,
      //   Header: ({ column }) => {
      //     return (
      //       <div className=" flex flex-col gap-[2px]">
      //         <span className="ml-1 cursor-pointer truncate">Participants</span>
      //       </div>
      //     );
      //   },
      //   Cell: ({ cell, row }) => {
      //     const participants = row.original?.participants;

      //     return (
      //       <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
      //         {participants?.length > 0 && (
      //           <select className="w-full border rounded-sm border-orange-300 p-1 text-black text-[14px]">
      //             {participants?.map((participant) => (
      //               <option
      //                 key={participant._id}
      //                 value={participant.userId._id}
      //               >
      //                 {participant?.userId?.name} - {participant?.score}
      //               </option>
      //             ))}
      //           </select>
      //         )}
      //       </div>
      //     );
      //   },
      //   filterFn: (row, columnId, filterValue) => {
      //     const cellValue =
      //       row.original[columnId]?.toString().toLowerCase() || "";

      //     return cellValue.includes(filterValue.toLowerCase());
      //   },
      // },
      {
        accessorKey: "winner",
        minSize: 60,
        maxSize: 200,
        size: 140,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer truncate">Winner</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const winner = row.original?.winner;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {winner && (
                <div className="w-full border rounded-sm border-orange-300 p-1 text-black text-[14px]">
                  {winner?.name} - {winner?.rank}
                </div>
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
        accessorKey: "resultsPosted",
        minSize: 100,
        maxSize: 180,
        size: 130,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer truncate">
                Results Posted
              </span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const resultsPosted = row.original?.resultsPosted;

          return (
            <div
              className={`flex items-center justify-start truncate ${
                resultsPosted ? "text-green-500" : "text-red-500"
              } cursor-pointer text-[13px] text-black w-full h-full`}
            >
              {resultsPosted ? "Yes" : "No"}
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
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/update/status/${row.original._id}`,
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
                  {status === "upcoming" ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-sky-600 bg-sky-200 hover:bg-sky-300 text-sky-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Upcoming
                    </button>
                  ) : status === "completed" ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-green-600 bg-green-200 hover:bg-green-300 text-green-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      completed
                    </button>
                  ) : (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-lime-600 bg-lime-200 hover:bg-lime-300 text-lime-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Ongoing
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
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            </div>
          );
        },
        // filterVariant: "select",
        // filterSelectOptions: ["pending", "approved", "rejected"],
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
                  setIsShow(true);
                  setEventId(row.original._id);
                  setSelectedEvent(row.original);
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
    [eventsData, filterEvents]
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
    <Adminlayout title="Events - PRLTA">
      <div className="w-full h-[100%] rounded-md flex flex-col gap-4 py-3 px-2 sm:px-4 bg-[#fff] overflow-hidden">
        <div className="flex items-start sm:items-end justify-between flex-col md:flex-row gap-4 ">
          <div className="flex items-center gap-4 md:gap-[5rem]">
            <h1 className="text-xl sm:text-2xl   font-bold text-gray-900 uppercase font-sans ">
              <span className="bg-gradient-to-r from-orange-600 to-gray-700 text-transparent bg-clip-text">
                Events
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
            {types.map((type, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 cursor-pointer rounded-md px-5 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 ${
                  type === selectedType
                    ? "bg-gray-100 border-2 border-orange-600 text-orange-600"
                    : "border-2"
                }`}
                onClick={() => handleTabClick(type)}
              >
                {type}
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
              onClick={() => setIsShow(true)}
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
        {isShow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-2 sm:p-4 bg-white/75 bg-blend-luminosity ">
            <div className="max-w-2xl w-full max-h-[99vh] ">
              <EventModal
                setIsShow={setIsShow}
                eventId={eventId}
                setEventId={setEventId}
                fetchData={fetchData}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
              />
            </div>
          </div>
        )}
      </div>
    </Adminlayout>
  );
}
