"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import LoadingAnimation from "./LoadingAnimation";

export default function Spinner() {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const counter = setInterval(() => {
      setCount((prevVal) => {
        if (prevVal === 0) {
          router.push("/");
          setAuth({ ...auth, user: null, token: "" });
          localStorage.removeItem("prlta");
          clearInterval(counter);
        }
        return prevVal - 1;
      });
    }, 1000);

    return () => {
      clearInterval(counter);
    };

    // eslint-disable-next-line
  }, [count, router]);
  return (
    <div className="wfull bg-white h-screen">
      <LoadingAnimation />
    </div>
  );
}
