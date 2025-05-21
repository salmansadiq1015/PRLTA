"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Adminlayout from "@/app/components/Layout/Adminlayout";
import { IoSearch } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { CiCircleChevLeft } from "react-icons/ci";
import { CiCircleChevRight } from "react-icons/ci";
import { IoCloseCircle } from "react-icons/io5";
import Loader from "@/app/utils/Loader";
import Image from "next/image";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import UserModal from "@/app/components/User/UserModal";
import { MdEditNotifications } from "react-icons/md";
import NitificationModel from "@/app/components/User/NitificationModel";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [active, setActive] = useState("All");
  const initialLoad = useRef(true);
  const [rowSelection, setRowSelection] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [userId, setUserId] = useState("");
  const [isUser, setIsUser] = useState(false);
  const [show, setShow] = useState(false);

  console.log("rowSelection:", rowSelection);

  // Get All Users
  const fetchUsers = async () => {
    if (initialLoad.current) {
      setLoading(true);
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/all/users`
      );

      if (data) {
        setUsers(data.users);
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
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilterUsers(users);
  }, [users]);

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    filterData(value);
  };

  // -------------Handle filtering by tabs and search---------------
  const filterData = (search = searchValue) => {
    let filtered = users;

    console.log("Search:", search);

    if (search) {
      const lowercasedSearch = search.toLowerCase();

      filtered = filtered.filter((user) => {
        const {
          name = "",
          email = "",
          address = "",
          role = "",
          points = "",
          rank = "",
          vessel_Name = "",
        } = user;

        return (
          name.toLowerCase().includes(lowercasedSearch) ||
          email.toLowerCase().includes(lowercasedSearch) ||
          address.toLowerCase().includes(lowercasedSearch) ||
          role.toLowerCase().includes(lowercasedSearch) ||
          String(points).includes(lowercasedSearch) ||
          String(rank).includes(lowercasedSearch) ||
          String(vessel_Name).includes(lowercasedSearch)
        );
      });
    }

    setFilterUsers(filtered);
  };

  const handleTabClick = (tab) => {
    setActive(tab);
    filterData(searchValue, tab);
  };

  // ----------------Pegination----------->
  const totalPages = Math.ceil(filterUsers?.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Get the current page data
  const paginatedData = filterUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Update Status/Role
  const updateUser = async (id, status, role) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/update/role/${id}`,
        {
          role,
          isActive: status,
        }
      );
      if (data) {
        setFilterUsers((prev) =>
          prev.map((item) => (item._id === id ? data : item))
        );
        fetchUsers();
        toast.success("User updated successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
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
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/delete/users/${id}`
      );
      if (data) {
        setFilterUsers(
          filterUsers.filter((user) => user._id !== id.toString())
        );
        toast.success("User deleted successfully!");
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  // Delete All Users

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
        handleDeleteAllUsers();
      }
    });
  };

  const handleDeleteAllUsers = async () => {
    if (!rowSelection) {
      return toast.error("Please select at least one user to delete.");
    }

    const userIdsArray = Object.keys(rowSelection);

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/delete/all/users`,
        { userIds: userIdsArray }
      );
      if (data) {
        toast.success("All users deleted successfully!");
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        minSize: 50,
        maxSize: 220,
        size: 150,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Name</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const avatar = row.original?.avatar;

          return (
            <div className="cursor-pointer text-[12px] text-black w-full h-full flex items-center gap-1">
              <div className=" w-[2rem] h-[2rem] relative rounded-full bg-sky-600 overflow-hidden flex items-center justify-center">
                {avatar ? (
                  <Image
                    src={avatar || "/profile.png"}
                    layout="fill"
                    alt={"Avatar"}
                    className="w-full h-full"
                  />
                ) : (
                  <h3 className="text-[18px] font-medium text-white uppercase">
                    {row.original?.name?.slice(0, 1)}
                  </h3>
                )}
              </div>
              <span className="text-[13px] text-black font-medium">
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
        accessorKey: "phone",
        minSize: 100,
        maxSize: 120,
        size: 120,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Phone</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const phone = row.original?.phone;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {phone}
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
        maxSize: 100,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Vessel Name</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const vesselName = row.original?.vessel_Name;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full">
              {vesselName ? vesselName : "--"}
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
        maxSize: 100,
        size: 80,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Rank</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const rank = row.original?.rank;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full">
              {rank ? rank : "--"}
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
        accessorKey: "points",
        minSize: 60,
        maxSize: 100,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Points</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const points = row.original?.points;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full">
              {points ? points : ""}
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
        accessorKey: "address",
        minSize: 100,
        maxSize: 300,
        size: 200,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Address</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const address = row.original?.address;

          return (
            <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full truncate">
              {address ? address : ""}
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
      //   accessorKey: "ratings",
      //   minSize: 60,
      //   maxSize: 100,
      //   size: 100,
      //   grow: false,
      //   Header: ({ column }) => {
      //     return (
      //       <div className=" flex flex-col gap-[2px]">
      //         <span className="ml-1 cursor-pointer">ratings</span>
      //       </div>
      //     );
      //   },
      //   Cell: ({ cell, row }) => {
      //     const ratings = row.original?.ratings;

      //     return (
      //       <div className="flex items-center justify-start cursor-pointer text-[13px] text-black w-full h-full">
      //         {ratings}
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
        accessorKey: "role",
        minSize: 70,
        maxSize: 140,
        size: 100,
        grow: false,
        Header: ({ column }) => {
          return (
            <div className=" flex flex-col gap-[2px]">
              <span className="ml-1 cursor-pointer">Role</span>
            </div>
          );
        },
        Cell: ({ cell, row }) => {
          const role = cell.getValue();
          const [userRole, setUserRole] = useState(role);
          const [show, setShow] = useState(false);

          const handleUpdate = async (value) => {
            setUserRole(value);
            updateUser(row.original._id, "", value);
          };

          return (
            <div className="w-full h-full">
              {!show ? (
                <div
                  onDoubleClick={() => setShow(true)}
                  className="flex items-center justify-start cursor-pointer text-[12px] text-black w-full h-full"
                >
                  {role === "admin" ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-sky-600 bg-sky-200 hover:bg-sky-300 text-sky-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Admin
                    </button>
                  ) : role === "moderator" ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-yellow-600 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Moderator
                    </button>
                  ) : role === "member" ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-purple-600 bg-purple-200 hover:bg-purple-300 text-purple-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Member
                    </button>
                  ) : (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-green-600 bg-green-200 hover:bg-green-300 text-green-900 hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      User
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
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="member">Regular Member</option>
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
        accessorKey: "isActive",
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
          const [userRole, setUserRole] = useState(status);
          const [show, setShow] = useState(false);

          const handleUpdate = async (value) => {
            setUserRole(value);
            try {
              const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/update/role/${row.original._id}`,
                {
                  isActive: value,
                }
              );
              if (data) {
                setFilterUsers((prev) =>
                  prev.map((item) =>
                    item._id === row.original._id ? data : item
                  )
                );
                fetchUsers();
                toast.success("Status updated");
              }
            } catch (error) {
              console.log("Error update status");
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
                  {status === true ? (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-green-600 bg-green-500 hover:bg-green-600 text-white hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Approved
                    </button>
                  ) : (
                    <button className=" py-[.35rem] px-4 rounded-[2rem] border-2 border-red-600 bg-red-600 hover:bg-red-600 text-white hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.03]">
                      Rejected
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
                  <option value="true">Approved</option>
                  <option value="false">Rejected</option>
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
                  setIsUser(true);
                  setUserId(row.original._id);
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
    [users]
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
    <Adminlayout title="Users - PRLTA">
      <div className="w-full h-[100%] rounded-md flex flex-col gap-4 py-3 px-2 sm:px-4 bg-[#fff] overflow-hidden">
        <div className="flex items-start sm:items-end justify-between flex-col md:flex-row gap-4 ">
          <div className="flex items-center gap-4 md:gap-[5rem]">
            <h1 className="text-xl sm:text-2xl   font-bold text-gray-900 uppercase font-sans ">
              <span className="bg-gradient-to-r from-orange-600 to-gray-700 text-transparent bg-clip-text">
                Users
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
          <div className="w-full overflow-x-auto py-1 px-1 sm:px-0 sm:py-0 shidden"></div>
          {/*  */}
          <div className="flex items-center w-full md:w-fit justify-end gap-5 ">
            <span
              onClick={() => setShow(true)}
              className="cursor-pointer p-1 rounded-full bg-gray-200/50 hover:bg-gray-300/60"
            >
              <MdEditNotifications
                className={`h-6 w-6 cursor-pointer transition-all duration-300 ease-in-out text-sky-500 hover:text-sky-600 `}
              />
            </span>
            <span
              disabled={Object.keys(rowSelection).length === 0}
              onClick={() => handleDeleteAllConfirmation()}
              className="cursor-pointer p-1 rounded-full bg-gray-200/50 hover:bg-gray-300/60"
            >
              <AiFillDelete
                className={`h-5 w-5 cursor-pointer transition-all duration-300 ease-in-out ${
                  Object.keys(rowSelection).length > 0
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              />
            </span>
            <button
              onClick={() => setIsUser(true)}
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
        {isUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-2 sm:p-4 bg-white/75 bg-blend-luminosity ">
            <div className="w-[48rem]">
              <UserModal
                // setShowAddUser={setIsUser}
                // userId={userId}
                // fetchUsers={fetchUsers}
                setUserId={setUserId}
                open={isUser}
                onOpenChange={setIsUser}
                userId={userId}
                onSuccess={fetchUsers}
              />
            </div>
          </div>
        )}

        {/* ----------------Handle Notification--------------- */}
        {show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-2 sm:p-4 bg-white/75 bg-blend-luminosity ">
            <div className="w-[32rem]">
              <NitificationModel users={users} setShow={setShow} />
            </div>
          </div>
        )}
      </div>
    </Adminlayout>
  );
}
