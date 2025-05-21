"use client";
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Analytics({ data, loading }) {
  const eventCategories =
    data?.events?.last12Months?.map((entry) => entry.month) || [];
  const eventSeriesData =
    data?.events?.last12Months?.map((entry) => entry.count) || [];

  const catchCategories =
    data?.catches?.last12Months?.map((entry) => entry.month) || [];
  const catchSeriesData =
    data?.catches?.last12Months?.map((entry) => entry.count) || [];

  // Events Bar Chart Options
  const eventChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    grid: {
      borderColor: "#E0E0E0",
      strokeDashArray: 5,
    },
    xaxis: {
      categories: eventCategories,
      labels: { style: { colors: "#6B7280", fontSize: "12px" }, rotate: -45 },
    },
    yaxis: {
      title: {
        text: "Events Count",
        style: { color: "#374151", fontSize: "14px" },
      },
      labels: { style: { colors: "#6B7280", fontSize: "12px" } },
    },
    colors: ["#FF7F50"],
    dataLabels: { enabled: false },
    tooltip: { theme: "dark" },
  };

  // Catches Line Chart Options
  const catchChartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
    },
    grid: {
      borderColor: "#E0E0E0",
      strokeDashArray: 5,
    },
    xaxis: {
      categories: catchCategories,
      labels: { style: { colors: "#6B7280", fontSize: "12px" }, rotate: -45 },
    },
    yaxis: {
      title: {
        text: "Catches Count",
        style: { color: "#374151", fontSize: "14px" },
      },
      labels: { style: { colors: "#6B7280", fontSize: "12px" } },
    },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#10B981"],
    dataLabels: { enabled: false },
    tooltip: { theme: "dark" },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Events Analytics (Bar Chart) */}
      <div className="bg-white border rounded-lg shadow-lg p-3">
        <h3 className="text-xl font-semibold mb-2">Events Analytics</h3>
        {loading || !data?.events?.last12Months?.length ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded-md"></div>
          </div>
        ) : (
          <Chart
            options={eventChartOptions}
            series={[{ name: "Events", data: eventSeriesData }]}
            type="bar"
            height={350}
          />
        )}
      </div>

      {/* Catches Analytics (Line Chart) */}
      <div className="bg-white border rounded-lg shadow-lg p-3">
        <h3 className="text-xl font-semibold mb-2">Catches Analytics</h3>
        {loading || !data?.catches?.last12Months?.length ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded-md"></div>
          </div>
        ) : (
          <Chart
            options={catchChartOptions}
            series={[{ name: "Catches", data: catchSeriesData }]}
            type="line"
            height={350}
          />
        )}
      </div>
    </div>
  );
}
