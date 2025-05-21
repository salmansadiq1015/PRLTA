import Image from "next/image";
import React from "react";
import { IoClose, IoMenu } from "react-icons/io5";

export default function Header({ show, setShow }) {
  return (
    <div className="bg-white px-4 py-2 shadow-md h-[4rem] border-b border-gray-300">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3 py-2 w-full">
          <Image
            src="/logo.png"
            alt="Ayoob"
            width={40}
            height={40}
            className="rounded-full "
          />
          <h1 className="text-xl sm:text-2xl 3xl:text-3xl  font-semibold text-customBrown font-serif">
            <span className="text-orange-600"> PR</span>LTA
          </h1>
        </div>
        <div className="">
          {!show ? (
            <div className=" flex sm:hidden  ">
              <IoMenu
                onClick={() => setShow(true)}
                size={25}
                className="text-black hover:text-customBrown transition-all duration-150"
              />
            </div>
          ) : (
            <div className="flex sm:hidden transition-all duration-300 hover:text-customBrown">
              <IoClose onClick={() => setShow(false)} size={25} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
