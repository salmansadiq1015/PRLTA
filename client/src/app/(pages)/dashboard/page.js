"use client";
import Adminlayout from "@/app/components/Layout/Adminlayout";
import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { RiGitRepositoryFill } from "react-icons/ri";
import { FileText, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
// import Chart from "react-apexcharts";
import dynamic from "next/dynamic";
import Image from "next/image";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Analytics = dynamic(
  () => import("../../components/dashboard/Analytics"),
  {
    ssr: false,
  }
);

export default function Dashboard() {
  const router = useRouter();
  const [countData, setCountData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchCount = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/activity/all/counts`
      );
      if (data) {
        setCountData(data.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/activity/analytics`
      );
      if (data) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchAnalytics();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/activity/all`,
        {
          params: { date },
        }
      );
      if (data) {
        setActivities(data.activities);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [date]);

  // User Analytics
  const categories = analytics.users?.last12Months?.map((entry) => entry.month);
  const seriesData = analytics.users?.last12Months?.map((entry) => entry.count);

  // ApexCharts Configuration
  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
    },
    grid: {
      borderColor: "#E0E0E0",
      strokeDashArray: 5,
    },
    xaxis: {
      categories,
      labels: { style: { colors: "#6B7280", fontSize: "12px" }, rotate: -45 },
    },
    yaxis: {
      title: { text: "Users", style: { color: "#374151", fontSize: "14px" } },
      labels: { style: { colors: "#6B7280", fontSize: "12px" } },
    },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        colorStops: [
          { offset: 0, color: "#3B82F6", opacity: 0.4 },
          { offset: 100, color: "#3B82F6", opacity: 0 },
        ],
      },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "dark" },
  };

  return (
    <Adminlayout title="Dashboard - PRLTA">
      <div className="w-full min-h-screen rounded-md flex flex-col gap-4 py-3 px-2 sm:px-4 overflow-hidden">
        {/* All List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div
            onClick={() => router.push("/users")}
            className="flex cursor-pointer items-center justify-center flex-col gap-3 bg-gradient-to-tr from-orange-100 via-orange-200 to-orange-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-orange-400 text-white rounded-full shadow-lg">
              <FaUsers className="text-2xl" />
            </div>
            <h2 className="text-lg font-medium text-center text-gray-800">
              Total Login Users
            </h2>
            <p className="text-3xl font-bold text-center text-gray-900">
              {countData.user}
            </p>
          </div>
          <div
            onClick={() => router.push("/catches")}
            className="flex cursor-pointer items-center justify-center flex-col gap-3 bg-gradient-to-tr from-pink-100 via-pink-200 to-pink-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-pink-400 text-white rounded-full shadow-lg">
              <RiGitRepositoryFill className="text-2xl" />
            </div>
            <h2 className="text-lg font-medium text-center text-gray-800">
              Total Catches
            </h2>
            <p className="text-3xl font-bold text-center text-gray-900">
              {countData.catch}
            </p>
          </div>
          <div
            onClick={() => router.push("/events")}
            className="flex cursor-pointer items-center justify-center flex-col gap-3 bg-gradient-to-tr from-yellow-100 via-yellow-200 to-yellow-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-yellow-400 text-white rounded-full shadow-lg">
              <Calendar className="text-2xl" />
            </div>
            <h2 className="text-lg font-medium text-center text-gray-800">
              Total Events
            </h2>
            <p className="text-3xl font-bold text-center text-gray-900">
              {countData.event}
            </p>
          </div>
          <div
            onClick={() => router.push("/blogs")}
            className="flex cursor-pointer items-center justify-center flex-col gap-3 bg-gradient-to-tr from-purple-100 via-purple-200 to-purple-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-purple-400 text-white rounded-full shadow-lg">
              <FileText className="text-2xl" />
            </div>
            <h2 className="text-lg font-medium text-center text-gray-800">
              Total Blogs
            </h2>
            <p className="text-3xl font-bold text-center text-gray-900">
              {countData.blog}
            </p>
          </div>
        </div>

        {/* Graphs & Activity */}
        <div className="grid grid-cols-3 gap-3 w-full bg-white shadow-md border rounded-lg p-2">
          <div className="col-span-3 sm:col-span-2">
            <h3 className="text-xl font-semibold mb-3">User Analytics</h3>
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                <div className="h-64 bg-gray-200 rounded-md"></div>
              </div>
            ) : (
              <Chart
                options={chartOptions}
                series={[{ name: "Users Count", data: seriesData }]}
                type="area"
                height={500}
              />
            )}
          </div>
          {/* --------------Activity---------------- */}
          <div className="flex flex-col col-span-3 sm:col-span-1 w-full ">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-[2.3rem] border-2 border-gray-900 bg-transparent outline-none rounded-md p-1 text-[14px]"
            />
            <h3 className=" px-3 bg-white font-semibold translate-y-[.8rem] ml-4  z-20 w-fit">
              Activies
            </h3>

            {!isLoading ? (
              <div className="flex flex-col gap-2 w-full h-full overflow-y-auto p-2 border-2 border-orange-600 rounded-md max-h-[70vh] pt-5">
                {activities?.map((activity) => (
                  <div
                    className="w-full flex flex-col gap-2 py-2 px-3 border border-gray-300 rounded-md shadow hover:shadow-md bg-white hover:bg-orange-50 transition-all duration-300 cursor-pointer hover:scale-[1.03] ease-in-out "
                    key={activity?._id}
                  >
                    <p className="mb-2 text-[15px] font-medium text-green-500 mt-2 flex items-center gap-2">
                      <span className="w-[.8rem] h-[.8rem] rounded-full bg-green-500"></span>
                      {new Date(activity?.createdAt).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="flex-shrink-0 ">
                        {activity?.userId?.avatar ? (
                          <Image
                            src={activity?.userId?.avatar || "/profile.png"}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover border"
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full text-white font-semibold flex items-center justify-center"
                            style={{
                              backgroundColor: `#${Math.floor(
                                Math.random() * 16777215
                              ).toString(16)}`,
                            }}
                          >
                            {activity?.userId?.name.slice(0, 1) || "A"}
                          </div>
                        )}
                      </div>
                      <strong className="text-[16px] font-medium text-black capitalize">
                        {activity?.userId?.name}
                      </strong>
                    </div>
                    {/* Action */}
                    <strong className="text-[15px] font-semibold text-black">
                      Action:{" "}
                      <span className="text-[13px] text-gray-700 ml-1 font-normal">
                        {activity?.activity}
                      </span>
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full h-full overflow-y-auto p-2 border-2 border-orange-600 rounded-md max-h-[70vh] pt-5">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="w-full flex flex-col gap-2 py-2 px-3 border border-gray-300 rounded-md shadow bg-gray-100 animate-pulse"
                  >
                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                    </div>

                    <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-full bg-white shadow-md border rounded-lg p-2">
          <Analytics data={analytics} loading={loading} />
        </div>
      </div>
    </Adminlayout>
  );
}
