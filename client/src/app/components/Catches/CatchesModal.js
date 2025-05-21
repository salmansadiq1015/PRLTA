import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Style } from "@/app/utils/CommonStyle";
import { format } from "date-fns";

const categoryOptions = [
  // "Freshwater",
  // "Saltwater",
  // "Predatory",
  // "Small Bait",
  // "Tropical",
  // "Coldwater",
  // "Pelagic",
  // "Deep-Sea",
  "Domestic",
  "International",
];

export default function CatchesModal({
  setIsCatch,
  catchesId,
  setCatchesId,
  fetchData,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vessel_Name, setVessel_Name] = useState("");
  const [location, setLocation] = useState("");
  const [fisherman, setFisherman] = useState("");
  const [vessel_Owned, setVessel_Owned] = useState("");
  const [shore, setShore] = useState("");
  const [category, setCategory] = useState("");
  const [tournament_name, setTournament_name] = useState("");
  const [date, setDate] = useState("");
  const [specie, setSpecie] = useState("");
  const [line_strenght, setLine_strenght] = useState("");
  const [fish_width, setFish_width] = useState("");
  const [fish_length, setFish_length] = useState("");
  const [status, setStatus] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [score, setScore] = useState("");
  const [rank, setRank] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errors, setErrors] = useState({ width: "", length: "" });

  const validateDecimal = (value) => {
    const num = parseFloat(value);
    return (
      /^(\d{1,2}(\.\d{1,2})?|100(\.00?)?)$/.test(value) &&
      !isNaN(num) &&
      num >= 0 &&
      num <= 100
    );
  };

  const handleFishWidthChange = (e) => {
    const val = e.target.value;
    setFish_width(val);

    if (!validateDecimal(val)) {
      setErrors((prev) => ({
        ...prev,
        width: "Please enter a valid number between 0.00 and 100.00.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, width: "" }));
    }
  };

  const handleFishLengthChange = (e) => {
    const val = e.target.value;
    setFish_length(val);

    if (!validateDecimal(val)) {
      setErrors((prev) => ({
        ...prev,
        length: "Please enter a valid number between 0.00 and 100.00.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, length: "" }));
    }
  };

  const isShoreSpecies = ["Tarpon", "Snook", "Jackfish", "Ladyfish"];
  const offShoreSpecies = [
    "Aguja Azul (Blue Marlin)",
    "Aguja Blanca (White Marlin)",
    "Pez Vela/Spearfish (Sailfish/Spearfish)",
  ];

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/all/users`
      );

      if (data) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get Tournaments
  const getTournaments = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/allEventforCatches`
      );

      if (data) {
        setTournaments(data.events);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    getTournaments();
  }, []);

  // Get Catch Details
  const getCatchDetails = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/catches/catch/detail/${catchesId}`
      );

      console.log("Data:", data);
      const catches = data.catches;
      if (data) {
        const selectedUser = users.find(
          (user) =>
            user.email?.trim().toLowerCase() ===
            catches.email?.trim().toLowerCase()
        );

        setSelectedUserId(selectedUser?._id);
        setEmail(catches.email);
        setVessel_Name(catches.vessel_Name);
        setLocation(catches.location);
        setFisherman(catches.fisherman);
        setVessel_Owned(catches.vessel_Owned);
        setShore(catches.shore);
        setCategory(catches.category);
        setTournament_name(catches.tournament_name);
        setDate(format(new Date(catches.date), "yyyy-MM-dd"));
        setSpecie(catches.specie);
        setLine_strenght(catches.line_strenght);
        setFish_width(catches.fish_width);
        setFish_length(catches.fish_length);
        setStatus(catches.status);
        setFeatured(catches.featured);
        setScore(catches.score);
        setRank(catches.rank);
        setLatitude(catches.latitude);
        setLongitude(catches.longitude);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCatchDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catchesId, users]);

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const catchData = {
      name,
      email,
      vessel_Name,
      location,
      fisherman,
      vessel_Owned,
      shore,
      category,
      tournament_name,
      date,
      specie,
      line_strenght,
      fish_width,
      fish_length,
      status,
      featured,
      score,
      rank,
      latitude,
      longitude,
    };
    try {
      if (catchesId) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/catches/update/catch/${catchesId}`,
          catchData
        );
        if (data) {
          fetchData();
          setCatchesId("");
          setIsCatch(false);
          setLoading(false);
          toast.success("Catches details Updated Successfully");
        } else {
          toast.error("Something Went Wrong");
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/catches/create/catch`,
          catchData
        );
        if (data) {
          fetchData();
          setCatchesId("");
          setIsCatch(false);
          setLoading(false);
          toast.success("Catches Added Successfully");
        } else {
          toast.error("Something Went Wrong");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUser = (userId) => {
    const selectedUser = users.find((user) => user._id === userId);
    setSelectedUserId(userId);

    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
    }
  };

  return (
    <div className="w-full bg-white rounded-md overflow-hidden shadow h-[99%] flex flex-col overflow-y-auto shidden">
      <div className="flex items-center justify-between bg-customOrange px-4 py-2 sm:py-3 ">
        <h3 className="text-lg font-semibold text-white">
          {catchesId ? "Edit Catches" : "Add Catches"}
        </h3>
        <span
          onClick={() => {
            setCatchesId("");
            setIsCatch(false);
          }}
          className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer "
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 px-4 py-2 mt-4 w-full h-[28rem] sm:h-[32rem] overflow-y-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Name<span className="text-red-700">*</span>
            </label>
            <select
              name="name"
              value={selectedUserId}
              onChange={(e) => handleUser(e.target.value)}
              className={`${Style.input} w-full`}
            >
              <option value="">Select User Name</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Email<span className="text-red-700">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Vessel Name
            </label>
            <input
              type="text"
              value={vessel_Name}
              onChange={(e) => setVessel_Name(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Vessel Name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Location"
            />
          </div>
          {catchesId && (
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Latitude"
              />
            </div>
          )}
          {catchesId && (
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Longitude"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Fisherman
            </label>
            <input
              type="text"
              value={fisherman}
              onChange={(e) => setFisherman(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Fisherman"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Vessel Owned
            </label>
            <input
              type="text"
              value={vessel_Owned}
              onChange={(e) => setVessel_Owned(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Vessel Owned"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Shore
            </label>
            <select
              value={shore}
              onChange={(e) => setShore(e.target.value)}
              className={`${Style.input} w-full`}
            >
              <option value="">Select Shore</option>
              <option value="Inshore">Inshore</option>
              <option value="Offshore">Offshore</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${Style.input} w-full`}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Tournament Name
            </label>

            <select
              value={tournament_name}
              onChange={(e) => setTournament_name(e.target.value)}
              className={`${Style.input} w-full`}
            >
              <option value="">Select Tournament</option>
              <option value="Fuera de Torneo">Fuera de Torneo</option>
              {tournaments?.map((tournament, index) => (
                <option key={index} value={tournament?.title}>
                  {tournament?.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Date"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Specie
            </label>
            {/* <input
              type="text"
              value={specie}
              onChange={(e) => setSpecie(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Specie"
            /> */}

            <select
              value={specie}
              onChange={(e) => setSpecie(e.target.value)}
              className={`${Style.input} w-full`}
            >
              <option value="">Select Specie</option>
              {shore === "Inshore"
                ? isShoreSpecies.map((specie, index) => (
                    <option key={index} value={specie}>
                      {specie}
                    </option>
                  ))
                : offShoreSpecies.map((specie, index) => (
                    <option key={index} value={specie}>
                      {specie}
                    </option>
                  ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Line Strenght
            </label>
            <input
              type="text"
              value={line_strenght}
              onChange={(e) => setLine_strenght(e.target.value)}
              className={`${Style.input} w-full`}
              placeholder="Line Strenght"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">
              Fish Width
            </label>
            <input
              type="text"
              value={fish_width}
              onChange={handleFishWidthChange}
              className={`${Style.input} w-full`}
              placeholder="Fish Width"
            />
            {errors.width && (
              <p className="text-red-500 text-sm">{errors.width}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 ">
            <label className="block text-sm font-medium text-gray-700">
              Fish Length
            </label>
            <input
              type="text"
              value={fish_length}
              onChange={handleFishLengthChange}
              className={`${Style.input} w-full`}
              placeholder="Fish Length"
            />
            {errors.length && (
              <p className="text-red-500 text-sm">{errors.length}</p>
            )}
          </div>
          {catchesId && (
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${Style.input} w-full`}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
          {catchesId && (
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Featured
              </label>
              <select
                value={featured}
                onChange={(e) => setFeatured(e.target.value)}
                className={`${Style.input} w-full`}
              >
                <option value="">Select Feature</option>
                <option value="true">Highlighted</option>
                <option value="false">Notable</option>
              </select>
            </div>
          )}
          {catchesId && (
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Catches Score
              </label>
              <input
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className={`${Style.input} w-full`}
                placeholder="Catch Score"
              />
            </div>
          )}
          {catchesId && (
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Catches Rank
              </label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className={`${Style.input} w-full`}
              >
                <option value="">Select Rank</option>
                {Array.from({ length: 1000 }, (_, i) => {
                  const value = i + 1;
                  const label =
                    value === 1
                      ? "1st"
                      : value === 2
                      ? "2nd"
                      : value === 3
                      ? "3rd"
                      : `${value}th`;

                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end w-full pb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCatchesId("");
                setIsCatch(false);
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
                <span>{catchesId ? "Save" : "SUBMIT"}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
