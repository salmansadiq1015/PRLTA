"use client";
import React, { useEffect, useState } from "react";
import { GiFishingBoat } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { RiGalleryFill } from "react-icons/ri";
import { MdEventNote } from "react-icons/md";
import { GrArticle } from "react-icons/gr";
import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import { IoLogOut } from "react-icons/io5";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { GiSchoolOfFish } from "react-icons/gi";

export default function Sidebar({ hide, setHide }) {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState("");

  // console.log("auth:", auth);

  useEffect(() => {
    const pathArray = window.location.pathname.split("/");
    const fileIdFromPath = pathArray[1];
    setActive(fileIdFromPath ? fileIdFromPath : "dashboard");

    // exlint-disable-next-line
  }, [setActive]);

  const logout = async () => {
    localStorage.removeItem("auth");
    setAuth({ ...auth, user: null, token: "" });
    router.push("/");
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] py-2 border-r border-gray-200 bg-white text-black">
      <div className="relative w-full h-[calc(100vh-10.5vh)] sm:h-[calc(100vh-7.5vh)]  overflow-y-auto scroll-smooth py-3 pb-[2rem] shidden">
        <div className="flex flex-col gap-3 ">
          {/* 1 */}
          <div
            className={` relative h-[2.8rem] 3xl:h-[3rem]  cursor-pointer hover:shadow-md   shadow-gray-300 filter hover:drop-shadow-md  overflow-hidden transition-all duration-300`}
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            <div
              className={`relative w-full h-full flex items-center ${
                active === "dashboard"
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 via-25% to-orange-400 text-customBrown"
                  : "bg-white"
              } px-2 z-30 bg-transparent hover:bg-gradient-to-r from-orange-500 via-orange-400 via-25% to-orange-300  transition-all duration-300 hover:border`}
            >
              {hide ? (
                <RiDashboardHorizontalFill
                  className="h-6 w-6 cursor-pointer ml-2"
                  style={{ color: active === "dashboard" ? "#fff" : "#000" }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <RiDashboardHorizontalFill
                    className="h-6 w-6 cursor-pointer ml-2"
                    style={{
                      color: active === "dashboard" ? "#fff" : "#000",
                    }}
                  />
                  <span
                    className="text-[16px] 3xl:text-[18px] font-[500]"
                    style={{
                      color: active === "dashboard" ? "#fff" : "#000",
                    }}
                  >
                    Dashboard
                  </span>
                </div>
              )}
            </div>
          </div>
          <hr className="w-full h-[1px] bg-gray-400" />
          {/* user */}
          <div
            className={` relative h-[2.8rem] 3xl:h-[3rem]  cursor-pointer hover:shadow-md   shadow-gray-300 filter hover:drop-shadow-md  overflow-hidden transition-all duration-300`}
            onClick={() => {
              router.push("/users");
            }}
          >
            <div
              className={`relative w-full h-full flex items-center ${
                active === "users"
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 via-25% to-orange-400 text-customBrown"
                  : "bg-white"
              } px-2 z-30 bg-transparent hover:bg-gradient-to-r from-orange-500 via-orange-400 via-25% to-orange-300  transition-all duration-300 hover:border`}
            >
              {hide ? (
                <FaUsers
                  className="h-6 w-6 cursor-pointer ml-2"
                  style={{ color: active === "users" ? "#fff" : "#000" }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <FaUsers
                    className="h-6 w-6 cursor-pointer ml-2"
                    style={{
                      color: active === "users" ? "#fff" : "#000",
                    }}
                  />
                  <span
                    className="text-[16px] 3xl:text-[18px] font-[500]"
                    style={{
                      color: active === "users" ? "#fff" : "#000",
                    }}
                  >
                    Users
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Projects */}
          <div
            className={` relative h-[2.8rem] 3xl:h-[3rem]  cursor-pointer hover:shadow-md   shadow-gray-300 filter hover:drop-shadow-md  overflow-hidden transition-all duration-300`}
            onClick={() => {
              router.push("/catches");
            }}
          >
            <div
              className={`relative w-full h-full flex items-center ${
                active === "catches"
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 via-25% to-orange-400 text-customBrown"
                  : "bg-white"
              } px-2 z-30 bg-transparent hover:bg-gradient-to-r from-orange-500 via-orange-400 via-25% to-orange-300  transition-all duration-300 hover:border`}
            >
              {hide ? (
                <GiFishingBoat
                  className="h-6 w-6 cursor-pointer ml-2"
                  style={{
                    color: active === "catches" ? "#fff" : "#000",
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <GiFishingBoat
                    className="h-6 w-6 cursor-pointer ml-2"
                    style={{
                      color: active === "catches" ? "#fff" : "#000",
                    }}
                  />
                  <span
                    className="text-[16px] 3xl:text-[18px] font-[500]"
                    style={{
                      color: active === "catches" ? "#fff" : "#000",
                    }}
                  >
                    Catches
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Events */}
          <div
            className={` relative h-[2.8rem] 3xl:h-[3rem]  cursor-pointer hover:shadow-md   shadow-gray-300 filter hover:drop-shadow-md  overflow-hidden transition-all duration-300`}
            onClick={() => {
              router.push("/events");
            }}
          >
            <div
              className={`relative w-full h-full flex items-center ${
                active === "events"
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 via-25% to-orange-400 text-customBrown"
                  : "bg-white"
              } px-2 z-30 bg-transparent hover:bg-gradient-to-r from-orange-500 via-orange-400 via-25% to-orange-300  transition-all duration-300 hover:border`}
            >
              {hide ? (
                <MdEventNote
                  className="h-6 w-6 cursor-pointer ml-2"
                  style={{
                    color: active === "events" ? "#fff" : "#000",
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MdEventNote
                    className="h-6 w-6 cursor-pointer ml-2"
                    style={{
                      color: active === "events" ? "#fff" : "#000",
                    }}
                  />
                  <span
                    className="text-[16px] 3xl:text-[18px] font-[500]"
                    style={{
                      color: active === "events" ? "#fff" : "#000",
                    }}
                  >
                    Events
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Fishing Spot */}
          <div
            className={` relative h-[2.8rem] 3xl:h-[3rem]  cursor-pointer hover:shadow-md   shadow-gray-300 filter hover:drop-shadow-md  overflow-hidden transition-all duration-300`}
            onClick={() => {
              router.push("/fishing/spots");
            }}
          >
            <div
              className={`relative w-full h-full flex items-center ${
                active === "fishing"
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 via-25% to-orange-400 text-customBrown"
                  : "bg-white"
              } px-2 z-30 bg-transparent hover:bg-gradient-to-r from-orange-500 via-orange-400 via-25% to-orange-300  transition-all duration-300 hover:border`}
            >
              {hide ? (
                <GiSchoolOfFish
                  className="h-6 w-6 cursor-pointer ml-2"
                  style={{
                    color: active === "fishing" ? "#fff" : "#000",
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <GiSchoolOfFish
                    className="h-6 w-6 cursor-pointer ml-2"
                    style={{
                      color: active === "fishing" ? "#fff" : "#000",
                    }}
                  />
                  <span
                    className="text-[16px] 3xl:text-[18px] font-[500]"
                    style={{
                      color: active === "fishing" ? "#fff" : "#000",
                    }}
                  >
                    Fishing Spot
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          {/* <div
            className={` relative h-[2.8rem] 3xl:h-[3rem]  cursor-pointer hover:shadow-md   shadow-gray-300 filter hover:drop-shadow-md  overflow-hidden transition-all duration-300`}
            onClick={() => {
              router.push("/gallery");
            }}
          >
            <div
              className={`relative w-full h-full flex items-center ${
                active === "gallery"
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 via-25% to-orange-400 text-customBrown"
                  : "bg-white"
              } px-2 z-30 bg-transparent hover:bg-gradient-to-r from-orange-500 via-orange-400 via-25% to-orange-300  transition-all duration-300 hover:border`}
            >
              {hide ? (
                <RiGalleryFill
                  className="h-6 w-6 cursor-pointer ml-2"
                  style={{
                    color: active === "gallery" ? "#fff" : "#000",
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <RiGalleryFill
                    className="h-6 w-6 cursor-pointer ml-2"
                    style={{
                      color: active === "gallery" ? "#fff" : "#000",
                    }}
                  />
                  <span
                    className="text-[16px] 3xl:text-[18px] font-[500]"
                    style={{
                      color: active === "gallery" ? "#fff" : "#000",
                    }}
                  >
                    Gallery
                  </span>
                </div>
              )}
            </div>
          </div> */}

          {/* Notifications */}
          {/* <div
            className={` relative h-[2.8rem] 3xl:h-[3rem]  cursor-pointer hover:shadow-md   shadow-gray-300 filter hover:drop-shadow-md  overflow-hidden transition-all duration-300`}
            onClick={() => {
              router.push("/notifications");
            }}
          >
            <div
              className={`relative w-full h-full flex items-center ${
                active === "notifications"
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 via-25% to-orange-400 text-customBrown"
                  : "bg-white"
              } px-2 z-30 bg-transparent hover:bg-gradient-to-r from-orange-500 via-orange-400 via-25% to-orange-300  transition-all duration-300 hover:border`}
            >
              {hide ? (
                <MdNotificationsActive
                  className="h-6 w-6 cursor-pointer ml-2"
                  style={{
                    color: active === "notifications" ? "#fff" : "#000",
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MdNotificationsActive
                    className="h-6 w-6 cursor-pointer ml-2"
                    style={{
                      color: active === "notifications" ? "#fff" : "#000",
                    }}
                  />
                  <span
                    className="text-[16px] 3xl:text-[18px] font-[500]"
                    style={{
                      color: active === "notifications" ? "#fff" : "#000",
                    }}
                  >
                    Notification
                  </span>
                </div>
              )}
            </div>
          </div> */}

          {/* Settings */}
          <div
            className={` relative h-[2.8rem] 3xl:h-[3rem]  cursor-pointer hover:shadow-md   shadow-gray-300 filter hover:drop-shadow-md  overflow-hidden transition-all duration-300`}
            onClick={() => {
              router.push("/blogs");
            }}
          >
            <div
              className={`relative w-full h-full flex items-center ${
                active === "blogs"
                  ? "bg-gradient-to-r from-orange-600 via-orange-500 via-25% to-orange-400 text-customBrown"
                  : "bg-white"
              } px-2 z-30 bg-transparent hover:bg-gradient-to-r from-orange-500 via-orange-400 via-25% to-orange-300  transition-all duration-300 hover:border`}
            >
              {hide ? (
                <GrArticle
                  className="h-6 w-6 cursor-pointer ml-2"
                  style={{
                    color: active === "blogs" ? "#fff" : "#000",
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <GrArticle
                    className="h-6 w-6 cursor-pointer ml-2"
                    style={{
                      color: active === "blogs" ? "#fff" : "#000",
                    }}
                  />
                  <span
                    className="text-[16px] 3xl:text-[18px] font-[500]"
                    style={{
                      color: active === "blogs" ? "#fff" : "#000",
                    }}
                  >
                    Blogs
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Auth Profile */}
      <div className="w-full flex items-center justify-between sticky bottom-1 left-0 z-50 px-2 ">
        <div className="flex items-center gap-2">
          <div className="relative w-[2.7rem] h-[2.7rem] bg-gray-200 rounded-full border">
            <Image
              src={auth?.user?.avatar || "/profile.png"}
              alt="user"
              className="rounded-full"
              width={50}
              height={50}
              layout="responsive"
              objectFit="cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-medium text-gray-950 truncate ">
              {auth?.user?.name}
            </span>
            <span className="text-[11px] font-medium text-gray-600 uppercase text-center">
              {auth?.user?.role}
            </span>
          </div>
        </div>
        {/* Logout */}
        <span>
          <IoLogOut
            className="h-6 w-6 cursor-pointer text-gray-950 hover:text-red-600"
            onClick={logout}
          />
        </span>
      </div>
    </div>
  );
}
