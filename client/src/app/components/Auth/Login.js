"use client";
import { useAuth } from "@/app/context/authContext";
import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { MdOutlineAttachEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";

export default function Login() {
  const { auth, setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  //   Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/login_user`,
        { email, password }
      );
      if (data) {
        router.push("/dashboard");
        toast.success("Login Successful");
        setAuth({ ...auth, user: data.user, token: data.token });
        localStorage.setItem("prlta", JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };
  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full h-full grid grid-cols-8 gap-4 ">
        {/* Image */}
        <div className="col-span-4 w-full h-full hidden sm:block">
          <div className="relative w-full h-screen">
            <Image
              src="/left.jpg"
              alt="login"
              layout="fill"
              objectFit="fill"
              priority={true}
            />
          </div>
        </div>
        {/*  */}
        <div className=" col-span-8 sm:col-span-4 w-full h-full p-3 sm:p-4 flex items-center justify-center">
          <form onSubmit={handleLogin} className="max-w-[28rem] w-full">
            <div className="flex items-center justify-center text-black flex-col gap-2 w-full">
              <Image src="/logo.png" alt="Ayoob" width={100} height={100} />

              <h2 className=" text-2xl sm:text-3xl font-semibold text-center text-black">
                Welcome to <span className="tgradient">PRLTA</span>
              </h2>
              <div className="flex flex-col gap-4 w-full mt-4 ">
                <div className="relative w-full">
                  <MdOutlineAttachEmail className="absolute top-[.7rem] left-2 h-5 w-5  z-10  " />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${Style.input} text-black pl-8`}
                  />
                </div>

                <div className="relative w-full">
                  <span
                    className="absolute top-[.5rem] right-2   z-10  cursor-pointer "
                    onClick={() => setShow(!show)}
                  >
                    {!show ? (
                      <IoMdEyeOff className="h-6 w-6 text-black" />
                    ) : (
                      <IoEye className="h-6 w-6 text-black" />
                    )}
                  </span>

                  <TbPasswordUser className="absolute top-[.7rem] left-2 h-5 w-5 z-10 " />

                  <input
                    type={show ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    minLength={8}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${Style.input} text-black pl-8`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[14px] text-gray-700">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 border rounded-sm bg-white  accent-orange-600 cursor-pointer relative  "
                    />
                    Remember me
                  </span>

                  {/* <span
                  onClick={() => setActive("resetPassword")}
                  className="text-[14px] text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Forgot Password
                </span> */}
                </div>
                {/* Button */}
                <div className="flex items-center justify-center w-full py-4 px-2 sm:px-[2rem]">
                  <button type="submit" className={`${Style.button1}`}>
                    {loading ? (
                      <BiLoaderCircle className="h-5 w-5 text-white animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
