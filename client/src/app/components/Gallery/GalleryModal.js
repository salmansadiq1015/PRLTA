"use client";
import { Style } from "@/app/utils/CommonStyle";
import { uploadFile } from "@/app/utils/UploadFile";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { ImSpinner } from "react-icons/im";

export default function GalleryModal({
  setIsShow,
  galleryId,
  setGalleryId,
  fetchData,
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  // Handle Media Upload
  const handleMediaUpload = async (e) => {
    setImageLoading(true);
    const files = await uploadFile(e.target.files[0]);
    setImage(files[0]);
    setImageLoading(false);
  };

  // Handle Media Removal
  const removeMedia = () => {
    setImage("");
  };

  //   Fetch Details
  const fetchDetails = async () => {
    if (!galleryId) return;
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/gallery/image/detail/${galleryId}`
      );
      if (data) {
        const gallery = data.imagedetail;
        setTitle(gallery?.title);
        setImage(gallery?.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [galleryId]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title) {
      toast.error("Please enter a title");
      setLoading(false);
      return;
    }

    try {
      if (galleryId) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/gallery/update/gallery/${galleryId}`,
          { title, image }
        );
        if (data) {
          fetchData();
          toast.success("Gallery updated successfully!");
          setGalleryId("");
          setIsShow(false);
          setTitle("");
          setImage("");
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/gallery/postGalleryImage`,
          { title, image }
        );
        if (data) {
          fetchData();
          toast.success("Gallery added successfully!");
          setGalleryId("");
          setIsShow(false);
          setTitle("");
          setImage("");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
      setSelectedEvent({});
    }
  };

  return (
    <div className="w-full bg-white rounded-md overflow-hidden shadow h-[99%] flex flex-col overflow-y-auto shidden">
      <div className="flex items-center justify-between bg-customOrange px-4 py-2 sm:py-3 ">
        <h3 className="text-lg font-semibold text-white">
          {galleryId ? "Edit Gallery" : "Add Gallery"}
        </h3>
        <span
          onClick={() => {
            setGalleryId("");
            setIsShow(false);
          }}
          className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer "
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full px-2 sm:px-4 py-3"
      >
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700">
            Title<span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${Style.input} w-full`}
            placeholder="Title"
            required
          />
        </div>
        {/* --------------Add Media -------------------*/}
        {!image ? (
          <div className="border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center rounded-md">
            <label className="cursor-pointer flex flex-col items-center">
              <span>
                {imageLoading ? (
                  <ImSpinner className="text-[30px] pb-2 text-orange-700 hover:text-orange-700 animate-spin" />
                ) : (
                  <IoCameraOutline className="text-[35px] text-orange-700 hover:text-orange-700" />
                )}
              </span>
              <span className="text-orange-700 px-4 py-[.3rem] text-[13px] font-normal rounded-sm text-sm border-2 border-red-700  hover:bg-red-700 hover:text-white transition-all duration-300 hover:shadow-md">
                Add Media
              </span>
              <input
                type="file"
                // multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleMediaUpload}
              />
            </label>
          </div>
        ) : (
          <div className="relative w-[100%] h-[16rem] bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
            <div className="w-[100%] h-[100%] relative rounded-md overflow-hidden flex items-center justify-center">
              <Image
                src={image}
                layout="fill"
                alt={"Thumnail"}
                className="w-full h-full"
              />
            </div>

            <span
              onClick={() => removeMedia()}
              className="absolute top-[.2rem] right-[.2rem] z-10 bg-red-600 text-white text-xs rounded-full cursor-pointer"
            >
              <IoIosClose className="text-[20px]" />
            </span>
          </div>
        )}

        <div className="flex items-center justify-end w-full pb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setGalleryId("");
                setIsShow(false);
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
              {loading ? (
                <span>
                  <FaSpinner className="h-5 w-5 text-white animate-spin" />
                </span>
              ) : (
                <span>{galleryId ? "Save" : "SUBMIT"}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
