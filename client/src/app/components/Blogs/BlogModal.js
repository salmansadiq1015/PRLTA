"use client";
import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { uploadFile } from "@/app/utils/UploadFile";
// import ReactQuill from "react-quill-new";
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});
import "react-quill-new/dist/quill.snow.css";

export default function BlogModal({
  setIsShow,
  blogsId,
  setBlogsId,
  fetchData,
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
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
    if (!blogsId) return;
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/blogs/blog/detail/${blogsId}`
      );
      if (data) {
        const blog = data.blog;
        setTitle(blog?.title);
        setImage(blog?.banner);
        setDescription(blog?.description);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [blogsId]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title) {
      toast.error("Please enter a title");
      setLoading(false);
      return;
    }

    const formData = {
      title,
      banner: image,
      description,
    };

    try {
      if (blogsId) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/blogs/updateBlog/${blogsId}`,
          formData
        );
        if (data) {
          fetchData();
          toast.success("Blog updated successfully!");
          setBlogsId("");
          setIsShow(false);
          setTitle("");
          setImage("");
          setDescription("");
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/blogs/postBlog`,
          formData
        );
        if (data) {
          fetchData();
          toast.success("Blog added successfully!");
          setBlogsId("");
          setIsShow(false);
          setTitle("");
          setImage("");
          setDescription("");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "ordered",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="w-full bg-white rounded-md overflow-hidden shadow h-[99%] flex flex-col overflow-y-auto shidden">
      <div className="flex items-center justify-between bg-customOrange px-4 py-2 sm:py-3 ">
        <h3 className="text-lg font-semibold text-white">
          {blogsId ? "Edit Blog" : "Add Blog"}
        </h3>
        <span
          onClick={() => {
            setBlogsId("");
            setIsShow(false);
          }}
          className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer "
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full px-2 sm:px-4 py-3 max-h-[90vh] overflow-y-auto"
      >
        {/* --------------Add Media -------------------*/}
        <div className="w-full flex items-center justify-center">
          {!image ? (
            <div className="border-2 border-dashed w-full sm:w-[60%] h-[12rem] border-gray-300 p-4 flex flex-col items-center justify-center rounded-md">
              <label className="cursor-pointer flex flex-col items-center">
                <span>
                  {imageLoading ? (
                    <FaSpinner className="animate-spin text-[25px] pb-2 text-orange-700 hover:text-orange-700" />
                  ) : (
                    <IoCameraOutline className="text-[35px] text-orange-700 hover:text-orange-700" />
                  )}
                </span>
                <span className="text-orange-700 px-4 py-[.3rem] text-[13px] font-normal rounded-sm text-sm border-2 border-red-700  hover:bg-red-700 hover:text-white transition-all duration-300 hover:shadow-md">
                  Add Banner
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </label>
            </div>
          ) : (
            <div className="relative w-full sm:w-[60%] h-[14rem] bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
              <div className="w-[100%] h-[100%] relative rounded-md overflow-hidden flex items-center justify-center">
                <Image
                  src={image}
                  layout="fill"
                  alt={"Thumnail"}
                  className="w-full h-full"
                  unoptimized={true}
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
        </div>
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
        {/* Description */}

        {/*  */}
        <div>
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            className="rounded-md relative min-h-[11rem] max-[28rem] h-[12rem] 2xl:h-[22rem]"
            value={description}
            onChange={setDescription}
            style={{ height: "300px" }}
          />
        </div>

        <div className="flex items-center justify-end w-full pb-3 mt-[2.5rem]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setBlogsId("");
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
                <span>{blogsId ? "Save" : "SUBMIT"}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
