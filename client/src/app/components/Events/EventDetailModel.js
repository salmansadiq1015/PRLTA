import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  Calendar,
  Trophy,
  Mail,
  Ship,
  Star,
  Bell,
  Lock,
  CalendarDays,
  Info,
} from "lucide-react";

export default function EventDetailsModal({ event }) {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy h:mm a");
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col  gap-6">
        <div className="w-full flex flex-col gap-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={event?.image || "/placeholder.svg?height=200&width=300"}
              alt={event?.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{event?.title}</h2>
            <p className="text-muted-foreground mt-1 p-1 rounded-md bg-gray-50 w-full border ">
              {event?.description}
            </p>
          </div>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Start Date:</span>
                <span className="ml-2 text-sm">
                  {formatDate(event?.startDate)}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">End Date:</span>
                <span className="ml-2 text-sm">
                  {formatDate(event?.endDate)}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Created:</span>
                <span className="ml-2 text-sm">
                  {formatDate(event?.createdAt)}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Updated:</span>
                <span className="ml-2 text-sm">
                  {formatDate(event?.updatedAt)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
                <Badge className="ml-2" variant="outline">
                  {event?.status?.charAt(0).toUpperCase() +
                    event?.status?.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Upcoming:</span>
                <Badge
                  className="ml-2"
                  variant={event?.isUpcoming ? "default" : "outline"}
                >
                  {event?.isUpcoming ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Notifications:</span>
                <Badge
                  className="ml-2"
                  variant={event?.notificationsSent ? "default" : "outline"}
                >
                  {event?.notificationsSent ? "Sent" : "Not Sent"}
                </Badge>
              </div>
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  className="ml-2"
                  variant={event?.isClosed ? "destructive" : "outline"}
                >
                  {event?.isClosed ? "Closed" : "Open"}
                </Badge>
              </div>
              <div className="flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Results:</span>
                <Badge
                  className="ml-2"
                  variant={event?.resultsPosted ? "success" : "outline"}
                >
                  {event?.resultsPosted ? "Posted" : "Not Posted"}
                </Badge>
              </div>
            </div>
            {/*  */}
          </div>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="catches">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="catches">
            Catches ({event.catches?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="winner">Winner</TabsTrigger>
        </TabsList>
        <TabsContent value="catches" className="mt-4">
          <ScrollArea className="h-[300px]">
            {event?.catches && event?.catches?.length > 0 ? (
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
                  {event?.catches?.map((catch_) => (
                    <TableRow key={catch_._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                catch_.user?.avatar ||
                                "/placeholder.svg?height=32&width=32"
                              }
                              alt={catch_.name}
                            />
                            <AvatarFallback>
                              {catch_.name?.substring(0, 2).toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{catch_.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {catch_.user?._id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{catch_.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          <span>{catch_.vessel_Name || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-base">
                          {catch_.score}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">{catch_.rank}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-20" />
                <p className="text-muted-foreground">
                  No catches recorded for this event.
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="winner" className="mt-4">
          {event?.catches && event?.catches?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vessel</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event?.winners?.map((winner) => (
                  <TableRow key={winner?._id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Image
                          src={
                            winner?.images[0] ||
                            "/placeholder.svg?height=80&width=100"
                          }
                          alt="WinnerImage"
                          width={100}
                          height={80}
                          className="object-contain h-[80px]"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium">{winner?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {winner?.user?._id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{winner?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Ship className="h-4 w-4 text-muted-foreground" />
                        <span>{winner?.vessel_Name || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-base">
                        {winner?.score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">{winner?.rank}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-20" />
              <p className="text-muted-foreground">No winner declared yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Event ID</h3>
        <code className="bg-muted p-2 rounded-md block text-xs font-mono">
          {event?._id}
        </code>
      </div>
    </div>
  );
}
