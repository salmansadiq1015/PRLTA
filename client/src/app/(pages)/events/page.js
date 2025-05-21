"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { format, set } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Bell,
  Lock,
  ChevronDown,
  ChevronUp,
  Eye,
  Ship,
  Mail,
  Star,
} from "lucide-react";
import Adminlayout from "@/app/components/Layout/Adminlayout";
import EventDetailsModal from "@/app/components/Events/EventDetailModel";
import EventModal from "@/app/components/Events/EventModal";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRows, setSelectedRows] = useState({});
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [eventToView, setEventToView] = useState(null);
  const itemsPerPage = 10;
  const initialLoad = useRef(true);
  const [eventId, setEventId] = useState("");
  const [isShow, setIsShow] = useState(false);

  // Fetch events data
  const fetchEvents = async () => {
    if (initialLoad.current) {
      setLoading(true);
    }

    try {
      // For development, use mock data
      // In production, uncomment the API call

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/allEvents`
      );
      if (data) {
        setEvents(data.events);
        setFilteredEvents(data.events);
        setTotalPages(Math.ceil(data.events.length / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      if (initialLoad.current) {
        setLoading(false);
        initialLoad.current = false;
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search and tab
  const filterEvents = (search = searchValue, tab = selectedTab) => {
    let filtered = events;

    // Filter by tab/status
    if (tab !== "all") {
      filtered = events.filter((event) => event.status === tab);
    }

    // Filter by search term
    if (search) {
      const lowercasedSearch = search.toLowerCase();
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(lowercasedSearch)
      );
    }

    setFilteredEvents(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearch = (value) => {
    setSearchValue(value);
    filterEvents(value, selectedTab);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    filterEvents(searchValue, tab);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get current page data
  const currentEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage]);

  // Handle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/deleteEvent/${eventToDelete}`
      );

      if (data) {
        setFilteredEvents((prev) =>
          prev.filter((event) => event._id !== eventToDelete)
        );
        toast.success("Event deleted successfully");
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleteAlertOpen(false);
      setEventToDelete(null);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    const eventIds = Object.keys(selectedRows).filter((id) => selectedRows[id]);

    if (eventIds.length === 0) {
      toast.error("Please select at least one event to delete");
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/deleteMultipleEvents`,
        { ids: eventIds }
      );

      toast.success("Selected events deleted successfully");
      fetchEvents();
      setSelectedRows({});
    } catch (error) {
      console.error("Error deleting events:", error);
      toast.error("Failed to delete selected events");
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/events/update/status/${id}`,
        {
          status,
        }
      );

      if (data) {
        setEvents((prev) =>
          prev.map((event) => (event._id === id ? { ...event, status } : event))
        );
        setFilteredEvents((prev) =>
          prev.map((event) => (event._id === id ? { ...event, status } : event))
        );
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Open edit modal
  const openEditModal = (event) => {
    setEventId(event._id);
    setIsShow(true);
  };

  // Open details modal
  const openDetailsModal = (event) => {
    setEventToView(event);
    setIsDetailsModalOpen(true);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            <Clock className="w-3 h-3 mr-1" />
            Upcoming
          </Badge>
        );
      case "ongoing":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Ongoing
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-300"
          >
            {status}
          </Badge>
        );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  return (
    <Adminlayout title="Events Management">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Events Management
            </h1>
            <p className="text-muted-foreground">
              Manage your tournaments, competitions and events
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8 w-full"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedEvent(null);
                setIsShow(true);
              }}
              className="whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row  gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            {Object.keys(selectedRows).filter((id) => selectedRows[id]).length >
              0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="ml-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected (
                {
                  Object.keys(selectedRows).filter((id) => selectedRows[id])
                    .length
                }
                )
              </Button>
            )}
          </div>

          <TabsContent value={selectedTab} className="mt-0">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {Array?.from({ length: 5 })?.map((_, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[calc(100vh-150px)] overflow-hidden overflow-y-auto overflow-x-auto shidden">
                    <Table className="w-full   ">
                      <TableHeader>
                        <TableRow className=" bg-orange-500 hover:bg-orange-500 text-white">
                          <TableHead className="w-[30px]">
                            <Checkbox
                              checked={
                                currentEvents.length > 0 &&
                                currentEvents?.every(
                                  (event) => selectedRows[event._id]
                                )
                              }
                              onCheckedChange={(checked) => {
                                const newSelectedRows = { ...selectedRows };
                                currentEvents.forEach((event) => {
                                  newSelectedRows[event._id] = !!checked;
                                });
                                setSelectedRows(newSelectedRows);
                              }}
                              aria-label="Select all"
                              className="text-white"
                            />
                          </TableHead>
                          <TableHead className="w-[50px] "></TableHead>
                          <TableHead className=" min-w-[130px] text-white">
                            Image
                          </TableHead>
                          <TableHead className=" min-w-[200px]  text-white">
                            Title
                          </TableHead>
                          <TableHead className=" min-w-[240px]  text-white">
                            {" "}
                            Dates
                          </TableHead>
                          <TableHead className=" min-w-[170px]  text-white">
                            Status
                          </TableHead>
                          <TableHead className=" min-w-[100px]  text-white">
                            Details
                          </TableHead>
                          <TableHead className="text-right min-w-[100px]  text-white">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentEvents.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center py-10 text-muted-foreground"
                            >
                              No events found
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentEvents?.map((event, i) => (
                            <>
                              <TableRow key={i} className="group bg-orange-50">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedRows[event?._id] || false}
                                    onCheckedChange={() =>
                                      toggleRowSelection(event?._id)
                                    }
                                    aria-label={`Select ${event?.title}`}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      toggleRowExpansion(event?._id)
                                    }
                                    className="h-8 w-8"
                                  >
                                    {expandedRows[event?._id] ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <div className="relative h-12 w-20 overflow-hidden rounded-md">
                                    <Image
                                      src={
                                        event?.image ||
                                        "/placeholder.svg?height=48&width=80"
                                      }
                                      alt={event?.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium truncate">
                                    {event?.title}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="flex items-center">
                                      <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                                      <span>
                                        Start: {formatDate(event?.startDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center mt-1">
                                      <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                                      <span>
                                        End: {formatDate(event?.endDate)}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    <Select
                                      defaultValue={event?.status}
                                      onValueChange={(value) =>
                                        handleStatusUpdate(event._id, value)
                                      }
                                    >
                                      <SelectTrigger className="w-[130px] h-8">
                                        <SelectValue>
                                          {renderStatusBadge(event?.status)}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="upcoming">
                                          <div className="flex items-center">
                                            <Clock className="w-3.5 h-3.5 mr-2" />
                                            Upcoming
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="ongoing">
                                          <div className="flex items-center">
                                            <Calendar className="w-3.5 h-3.5 mr-2" />
                                            Ongoing
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="completed">
                                          <div className="flex items-center">
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                            Completed
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <div className="flex flex-col gap-1">
                                      {/* <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          event.isUpcoming
                                            ? "bg-blue-50 text-blue-700 border-blue-300"
                                            : "bg-gray-50 text-gray-700 border-gray-300"
                                        }`}
                                      >
                                        {event?.isUpcoming
                                          ? "Upcoming"
                                          : "Not Upcoming"}
                                      </Badge> */}
                                      {/* <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          event?.isClosed
                                            ? "bg-red-50 text-red-700 border-red-300"
                                            : "bg-green-50 text-green-700 border-green-300"
                                        }`}
                                      >
                                        {event?.isClosed ? (
                                          <Lock className="w-3 h-3 mr-1" />
                                        ) : null}
                                        {event?.isClosed ? "Closed" : "Open"}
                                      </Badge> */}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    {/* <div className="flex items-center">
                                      <Badge
                                        variant="outline"
                                        className={`${
                                          event?.resultsPosted
                                            ? "bg-green-50 text-green-700 border-green-300"
                                            : "bg-amber-50 text-amber-700 border-amber-300"
                                        }`}
                                      >
                                        {event?.resultsPosted ? (
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                        ) : (
                                          <XCircle className="w-3 h-3 mr-1" />
                                        )}
                                        {event?.resultsPosted
                                          ? "Results Posted"
                                          : "No Results"}
                                      </Badge>
                                    </div> */}
                                    {/* <div className="flex items-center">
                                      <Badge
                                        variant="outline"
                                        className={`${
                                          event?.notificationsSent
                                            ? "bg-green-50 text-green-700 border-green-300"
                                            : "bg-amber-50 text-amber-700 border-amber-300"
                                        }`}
                                      >
                                        <Bell className="w-3 h-3 mr-1" />
                                        {event?.notificationsSent
                                          ? "Notifications Sent"
                                          : "No Notifications"}
                                      </Badge>
                                    </div> */}
                                    <div className="flex items-center">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                        onClick={() => openDetailsModal(event)}
                                      >
                                        <Eye className="w-3 h-3 mr-1" />
                                        View Details
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          Open menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                      align="end"
                                      className="z-[9999] w-40"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => openEditModal(event)}
                                        className="flex items-center cursor-pointer"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                      </DropdownMenuItem>

                                      <DropdownMenuItem
                                        onClick={() => {
                                          setEventToDelete(event._id);
                                          setIsDeleteAlertOpen(true);
                                        }}
                                        className="flex items-center text-red-600 cursor-pointer focus:bg-red-50"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                              {expandedRows[event?._id] && (
                                <TableRow>
                                  <TableCell
                                    colSpan={8}
                                    className="bg-gray-50 p-4"
                                  >
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="text-sm font-medium mb-2">
                                          Event Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                          <div>
                                            <p className="text-muted-foreground">
                                              ID:
                                            </p>
                                            <p className="font-mono text-xs">
                                              {event?._id}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-muted-foreground">
                                              Created:
                                            </p>
                                            <p>
                                              {formatDate(event?.createdAt)}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-muted-foreground">
                                              Updated:
                                            </p>
                                            <p>
                                              {formatDate(event?.updatedAt)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium mb-2">
                                          Catches ({event?.catches?.length || 0}
                                          )
                                        </h3>
                                        {event.catches &&
                                        event.catches.length > 0 ? (
                                          <div className="border rounded-md overflow-hidden">
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead>User</TableHead>
                                                  <TableHead>Email</TableHead>
                                                  <TableHead>Vessel</TableHead>
                                                  <TableHead>Score</TableHead>
                                                  <TableHead>Rank</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {event.catches.map((catch_) => (
                                                  <TableRow key={catch_._id}>
                                                    <TableCell>
                                                      <div className="flex items-center gap-2">
                                                        <Avatar className="h-6 w-6">
                                                          <AvatarImage
                                                            src={
                                                              catch_.user
                                                                ?.avatar ||
                                                              "/placeholder.svg?height=24&width=24"
                                                            }
                                                            alt={catch_.name}
                                                          />
                                                          <AvatarFallback>
                                                            {catch_.name
                                                              ?.substring(0, 2)
                                                              .toUpperCase() ||
                                                              "U"}
                                                          </AvatarFallback>
                                                        </Avatar>
                                                        <span>
                                                          {catch_.name}
                                                        </span>
                                                      </div>
                                                    </TableCell>
                                                    <TableCell>
                                                      <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        <span>
                                                          {catch_.email}
                                                        </span>
                                                      </div>
                                                    </TableCell>
                                                    <TableCell>
                                                      <div className="flex items-center gap-1">
                                                        <Ship className="h-3 w-3 text-muted-foreground" />
                                                        <span>
                                                          {catch_.vessel_Name ||
                                                            "N/A"}
                                                        </span>
                                                      </div>
                                                    </TableCell>
                                                    <TableCell>
                                                      <Badge variant="secondary">
                                                        {catch_.score}
                                                      </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                      <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-amber-500" />
                                                        <span>
                                                          {catch_.rank}
                                                        </span>
                                                      </div>
                                                    </TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        ) : (
                                          <p className="text-muted-foreground text-sm">
                                            No catches recorded for this event.
                                          </p>
                                        )}
                                      </div>

                                      <div>
                                        <h3 className="text-sm font-medium mb-2">
                                          Winners
                                        </h3>
                                        {event?.winners &&
                                        event?.winners?.length > 0 ? (
                                          <div className="border rounded-md overflow-hidden">
                                            <Table>
                                              <TableHeader>
                                                <TableRow>
                                                  <TableHead>User</TableHead>
                                                  <TableHead>Email</TableHead>
                                                  <TableHead>Vessel</TableHead>
                                                  <TableHead>Score</TableHead>
                                                  <TableHead>Rank</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {event?.winners?.map(
                                                  (catch_) => (
                                                    <TableRow key={catch_._id}>
                                                      <TableCell>
                                                        <div className="flex items-center gap-2">
                                                          <Avatar className="h-6 w-6">
                                                            <AvatarImage
                                                              src={
                                                                catch_?.user
                                                                  ?.avatar ||
                                                                "/placeholder.svg?height=24&width=24"
                                                              }
                                                              alt={catch_.name}
                                                            />
                                                            <AvatarFallback>
                                                              {catch_?.name
                                                                ?.substring(
                                                                  0,
                                                                  2
                                                                )
                                                                .toUpperCase() ||
                                                                "U"}
                                                            </AvatarFallback>
                                                          </Avatar>
                                                          <span>
                                                            {catch_?.name}
                                                          </span>
                                                        </div>
                                                      </TableCell>
                                                      <TableCell>
                                                        <div className="flex items-center gap-1">
                                                          <Mail className="h-3 w-3 text-muted-foreground" />
                                                          <span>
                                                            {catch_?.email}
                                                          </span>
                                                        </div>
                                                      </TableCell>
                                                      <TableCell>
                                                        <div className="flex items-center gap-1">
                                                          <Ship className="h-3 w-3 text-muted-foreground" />
                                                          <span>
                                                            {catch_?.vessel_Name ||
                                                              "N/A"}
                                                          </span>
                                                        </div>
                                                      </TableCell>
                                                      <TableCell>
                                                        <Badge variant="secondary">
                                                          {catch_?.score}
                                                        </Badge>
                                                      </TableCell>
                                                      <TableCell>
                                                        <div className="flex items-center gap-1">
                                                          <Star className="h-3 w-3 text-amber-500" />
                                                          <span>
                                                            {catch_?.rank}
                                                          </span>
                                                        </div>
                                                      </TableCell>
                                                    </TableRow>
                                                  )
                                                )}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        ) : (
                                          <p className="text-muted-foreground text-sm">
                                            No winner declared yet.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Event Modal */}
      {/* ----------------Handle Modals--------------- */}
      {isShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-2 sm:p-4 bg-white/75 bg-blend-luminosity ">
          <div className="max-w-2xl w-full max-h-[99vh] ">
            <EventModal
              setIsShow={setIsShow}
              eventId={eventId}
              setEventId={setEventId}
              fetchData={fetchEvents}
              selectedEvent={selectedEvent}
              setSelectedEvent={setSelectedEvent}
            />
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto shidden">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              Complete information about this event
            </DialogDescription>
          </DialogHeader>
          {eventToView && <EventDetailsModal event={eventToView} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              event and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Adminlayout>
  );
}
