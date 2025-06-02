"use client";

import { uploadFile } from "@/app/utils/UploadFile";
import axios from "axios";
import { format, parse } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  Check,
  ChevronDown,
  ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function EventModal({
  setIsShow,
  eventId,
  setEventId,
  fetchData,
  selectedEvent,
  setSelectedEvent,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [status, setStatus] = useState(null);
  const [winners, setWinners] = useState([]);
  const [resultsPosted, setResultsPosted] = useState(false);
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [resultPostedDate, setResultPostedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("details");
  const [catches, setCatches] = useState([]);

  console.log(isUpcoming, status, winners, resultsPosted);

  const tournaments = [
    { name: "Pasadía Sábalos", date: "15 March 2025" },
    { name: "Pasadía Offshore del Income", date: "5 April 2025" },
    // { name: "Seminario de Reglas", date: "10 April 2025" },
    // { name: "Wine & Fishing Tales", date: "8 May 2025" },
    { name: "Father & Sons @ Salina’s", date: "31 May 2025" },
    { name: "Vente tú @ Culebra", date: "12 July 2025" },
    { name: "Pasadía Sábalos Diurno", date: "23 August 2025" },
    { name: "Pasadía de Sábalos Nocturno", date: "20 September 2025" },
    { name: "Pasadía Offshore", date: "5 October 2025" },
    { name: "Asamblea Anual", date: "13 November 2025" },
    { name: "El Lechoneo Offshore", date: "10 January 2026" },
    { name: "Torneo Aniversario #63", date: "30 January to 1 February 2026" },
    { name: "Fiesta de Navidad", date: "7 February 2026" },
    { name: "Fuera de Torneo", date: "" }, // Optional: No specific date
  ];

  // Fetch Catches
  const fetchCatches = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/catches/name`
      );
      if (data) {
        const catches = data.catches;
        setCatches(catches);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCatches();
  }, []);

  // Fetch Details
  const fetchDetails = async () => {
    if (!eventId) return;
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/event/detail/${eventId}`
      );
      if (data) {
        const event = data.event;
        setTitle(event?.title);
        setDescription(event?.description);
        setStartDate(format(new Date(event?.startDate), "yyyy-MM-dd"));
        setEndDate(format(new Date(event?.endDate), "yyyy-MM-dd"));
        setResultPostedDate(
          format(new Date(event?.resultPostedDate || new Date()), "yyyy-MM-dd")
        );
        setIsUpcoming(event?.isUpcoming);
        setStatus({ value: event?.status, label: event?.status });
        setWinners(event?.winners);
        setResultsPosted(event?.resultsPosted);
        setImages(event?.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [eventId]);

  // Handle Media Upload
  const handleMediaUpload = async (e) => {
    setImageLoading(true);
    try {
      const files = await uploadFile(e.target.files[0]);
      setImages(files[0]);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setImageLoading(false);
    }
  };

  // Handle Media Removal
  const removeMedia = () => {
    setImages("");
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const winnersId = winners.map((winner) => winner.value);
    const formData = {
      title,
      description,
      startDate,
      endDate,
      isUpcoming: isUpcoming,
      status: status?.value ?? "upcoming",
      winners: [...winnersId],
      resultsPosted,
      image: images,
      resultPostedDate,
    };

    try {
      if (eventId) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/updateEvent/${eventId}`,
          formData
        );
        if (data) {
          fetchData();
          toast.success("Event updated successfully!");
          resetForm();
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/create/event`,
          formData
        );
        if (data) {
          fetchData();
          toast.success("Event added successfully!");
          resetForm();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEventId("");
    setIsShow(false);
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setIsUpcoming(false);
    setStatus(null);
    setWinners([]);
    setResultsPosted(false);
    setResultPostedDate(new Date());
    setImages("");
    setSelectedEvent({});
  };

  const participantsOptions =
    catches &&
    catches?.map((participant) => ({
      value: participant._id,
      label: participant.fisherman + " - " + participant.vessel_Name,
    }));

  const options = ["upcoming", "ongoing", "completed"];
  const statusOptions =
    options &&
    options?.map((option) => ({
      value: option,
      label: <div className="flex items-center capitalize">{option}</div>,
    }));

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.375rem",
      borderColor: "#e2e8f0",
      minHeight: "2.5rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#cbd5e1",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#f97316"
        : state.isFocused
        ? "#ffedd5"
        : null,
      color: state.isSelected ? "white" : "#1e293b",
      cursor: "pointer",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#ffedd5",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#f97316",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#f97316",
      "&:hover": {
        backgroundColor: "#f97316",
        color: "white",
      },
    }),
  };

  const handleTournamentChange = (option) => {
    const selectedTournament = tournaments.find((t) => t.name === option.value);
    setTitle(option.value);

    if (selectedTournament && selectedTournament.date) {
      const datePart = selectedTournament.date.split(" to ")[0];

      const parsedDate = parse(datePart, "d MMMM yyyy", new Date());

      if (!isNaN(parsedDate)) {
        setStartDate(format(parsedDate, "yyyy-MM-dd"));
      } else {
        setStartDate("");
      }
    } else {
      setStartDate("");
    }
  };

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden shadow-lg h-[99%] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          {eventId ? (
            <>
              <span>Edit Event</span>
              <Badge
                variant="outline"
                className="bg-white/20 text-white border-white/30"
              >
                {status?.value || "Draft"}
              </Badge>
            </>
          ) : (
            "Add New Event"
          )}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setEventId("");
            setIsShow(false);
            setSelectedEvent({});
          }}
          className="rounded-full bg-white/20 hover:bg-white/30 text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="details"
        className="flex-1 overflow-hidden"
        onValueChange={setActiveTab}
      >
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none bg-transparent border-b px-6">
            <TabsTrigger
              value="details"
              className={cn(
                "data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none border-b-2 border-transparent rounded-none",
                activeTab === "details"
                  ? "border-orange-500 text-orange-600"
                  : ""
              )}
            >
              Event Details
            </TabsTrigger>
            {eventId && (
              <TabsTrigger
                value="results"
                className={cn(
                  "data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 data-[state=active]:shadow-none border-b-2 border-transparent rounded-none",
                  activeTab === "results"
                    ? "border-orange-500 text-orange-600"
                    : ""
                )}
              >
                Results & Status
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <form onSubmit={handleSubmit} className="h-full overflow-y-auto">
          <TabsContent value="details" className="mt-0 h-full">
            <div className="p-6 space-y-6">
              {/* Media Upload Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Event Media</CardTitle>
                  <CardDescription>
                    Upload an image for your event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Upload Area */}
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 transition-all",
                        "hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer",
                        "w-full md:w-1/3 h-40"
                      )}
                    >
                      <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        {imageLoading ? (
                          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
                        ) : (
                          <ImageIcon className="h-10 w-10 text-orange-500" />
                        )}
                        <span className="mt-2 text-sm text-gray-600">
                          Click to upload
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleMediaUpload}
                          disabled={imageLoading}
                        />
                      </label>
                    </div>

                    {/* Preview Area */}
                    <div className="w-full md:w-2/3 flex flex-col">
                      {images ? (
                        <div className="relative rounded-lg overflow-hidden border bg-gray-50 h-40">
                          <Image
                            src={images || "/placeholder.svg"}
                            alt="Event image"
                            layout="fill"
                            objectFit="cover"
                            className="w-full h-full"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={removeMedia}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border">
                          <p className="text-gray-400 text-sm">
                            No image uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Event Information</CardTitle>
                  <CardDescription>
                    Basic details about your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Name of Tournament{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        id="title"
                        value={title ? { value: title, label: title } : null}
                        // onChange={(option) => setTitle(option.value)}
                        onChange={handleTournamentChange}
                        options={tournaments.map((t) => ({
                          value: t.name,
                          label: t.name,
                        }))}
                        placeholder="Select Tournament"
                        styles={customSelectStyles}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="startDate"
                          type="date"
                          value={
                            startDate instanceof Date
                              ? format(startDate, "yyyy-MM-dd")
                              : startDate
                          }
                          onChange={(e) => setStartDate(e.target.value)}
                          className="pl-10"
                          required
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">
                        End Date <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="endDate"
                          type="date"
                          value={
                            endDate instanceof Date
                              ? format(endDate, "yyyy-MM-dd")
                              : endDate
                          }
                          onChange={(e) => setEndDate(e.target.value)}
                          className="pl-10"
                          required
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="isUpcoming">Is Upcoming Event?</Label>
                      <div className="flex items-center space-x-2 h-10 pt-2">
                        <Switch
                          id="isUpcoming"
                          checked={isUpcoming}
                          onCheckedChange={setIsUpcoming}
                        />
                        <Label
                          htmlFor="isUpcoming"
                          className="text-sm text-gray-500"
                        >
                          {isUpcoming ? "Yes" : "No"}
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter event description"
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-0 h-full">
            <div className="p-6 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Event Status</CardTitle>
                  <CardDescription>
                    Manage the current status of your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        id="status"
                        value={status}
                        onChange={setStatus}
                        options={statusOptions}
                        placeholder="Select Status"
                        styles={customSelectStyles}
                        formatOptionLabel={({ value, label }) => (
                          <div className="flex items-center">
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full mr-2",
                                value === "upcoming"
                                  ? "bg-blue-500"
                                  : value === "ongoing"
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                              )}
                            ></span>
                            {label}
                          </div>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resultsPosted">Results Posted?</Label>
                      <div className="flex items-center space-x-2 h-10 pt-2">
                        <Switch
                          id="resultsPosted"
                          checked={resultsPosted}
                          onCheckedChange={setResultsPosted}
                        />
                        <Label
                          htmlFor="resultsPosted"
                          className="text-sm text-gray-500"
                        >
                          {resultsPosted ? "Yes" : "No"}
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resultPostedDate">
                        Result Posted Date
                      </Label>
                      <div className="relative">
                        <Input
                          id="resultPostedDate"
                          type="date"
                          value={
                            resultPostedDate instanceof Date
                              ? format(resultPostedDate, "yyyy-MM-dd")
                              : resultPostedDate
                          }
                          onChange={(e) => setResultPostedDate(e.target.value)}
                          className="pl-10"
                          disabled={!resultsPosted}
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="winner">Winner</Label>
                      <Select
                        id="winner"
                        value={winners}
                        isMulti={true}
                        onChange={setWinners}
                        options={participantsOptions}
                        placeholder="Select Winner"
                        styles={customSelectStyles}
                        isDisabled={!resultsPosted}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Catches Summary Card */}
              {selectedEvent?.catches && selectedEvent.catches.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Catches Summary</CardTitle>
                    <CardDescription>
                      Overview of participant catches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              Participant
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              Vessel
                            </th>
                            <th className="text-right py-3 px-4 font-medium text-gray-600">
                              Score
                            </th>
                            <th className="text-right py-3 px-4 font-medium text-gray-600">
                              Rank
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEvent.catches.map((catch_, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  {catch_.name}
                                  {winners?.value === catch_.user?._id && (
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                      Winner
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {catch_.vessel_Name}
                              </td>
                              <td className="py-3 px-4 text-right font-medium">
                                {catch_.score}
                              </td>
                              <td className="py-3 px-4 text-right">
                                {catch_.rank}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Footer with action buttons */}
          <div className="border-t p-4 sticky bottom-0 bg-white flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEventId("");
                setIsShow(false);
                setSelectedEvent({});
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {eventId ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {eventId ? "Save Changes" : "Create Event"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
