"use client";
import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";

export default function NitificationModel({ users, setShow }) {
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/notifications/send`,
        {
          message,
          userId,
        }
      );
      if (data) {
        toast.success("Notification sent successfully!");
        setShow(false);
        setMessage("");
        setUserId("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-md overflow-hidden shadow min-h-[15rem] max-h-[99%] flex flex-col">
      <div className="flex items-center justify-between bg-customOrange px-4 py-2 sm:py-3 ">
        <h3 className="text-lg font-medium text-white">Notification</h3>
        <span
          onClick={() => {
            setShow(false);
          }}
          className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer "
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 px-4 py-2 mt-4 h-full w-full "
      >
        <div className="flex flex-col gap-1 w-full">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className={`${Style.input} w-full`}
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option value={user._id} key={user._id}>
                {user?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700">
            Nitification Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${Style.input} w-full h-[8rem] resize-none`}
            placeholder="Message"
          />
        </div>
        <div className="flex items-center justify-end w-full pb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShow(false);
              }}
              type="button"
              className="w-[6rem] py-[.3rem] text-[14px] rounded-sm border-2 border-red-600 text-red-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.03] transition-all duration-300 "
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="w-[6rem] py-[.4rem] text-[14px] flex items-center justify-center rounded-sm bg-customOrange hover:shadow-md hover:scale-[1.03] transition-all duration-300 text-white"
            >
              {isLoading ? (
                <span>
                  <FaSpinner className="h-5 w-5 text-white animate-spin" />
                </span>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
