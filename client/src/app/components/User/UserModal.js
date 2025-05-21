"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X, Loader2, CheckCircle, User, MapPin, UserCog } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Form schema
const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  userName: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  vessel_Name: z.string().optional(),
  points: z.coerce.number().optional(),
  rank: z.coerce.number().optional(),
  role: z.enum(["admin", "user", "moderator", "member"]),
  isActive: z.boolean().default(true),
});

export default function UserModal({
  open,
  onOpenChange,
  userId,
  onSuccess,
  setUserId,
}) {
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneError, setPhoneError] = useState("");

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      userName: "",
      password: "",
      phone: "",
      address: "",
      vessel_Name: "",
      points: 0,
      rank: 0,
      role: "user",
      isActive: true,
    },
  });

  console.log("form:", form.getValues());

  // Get user details if userId is provided
  useEffect(() => {
    if (userId && open) {
      const fetchUserDetails = async () => {
        setFetchingUser(true);
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/user/info/${userId}`
          );

          const user = data.user[0];
          if (user) {
            let countryCode = "+1";
            let localPhone = user.phone || "";

            // Extract and strip country code
            if (user.phone?.startsWith("+1939")) {
              countryCode = "+1939";
              localPhone = user.phone.replace("+1939", "");
            } else if (user.phone?.startsWith("+1787")) {
              countryCode = "+1787";
              localPhone = user.phone.replace("+1787", "");
            } else if (user.phone?.startsWith("+1")) {
              countryCode = "+1";
              localPhone = user.phone.replace("+1", "");
            }

            setCountryCode(countryCode);

            // Reset form with local phone
            form.reset({
              name: user.name || "",
              email: user.email || "",
              userName: user.userName || "",
              phone: localPhone,
              address: user.address || "",
              vessel_Name: user.vessel_Name || "",
              points: user.points || 0,
              rank: user.rank || 0,
              role: user.role || "user",
              isActive: user.isActive ?? true, // keep boolean
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          toast.error("Failed to fetch user details");
        } finally {
          setFetchingUser(false);
        }
      };

      fetchUserDetails();
    } else if (!userId && open) {
      // Reset form when creating a new user
      form.reset({
        name: "",
        email: "",
        userName: "",
        password: "",
        phone: "",
        address: "",
        vessel_Name: "",
        points: 0,
        rank: 0,
        role: "user",
        isActive: true,
      });
      setCountryCode("+1");
    }
  }, [userId, open, form]);

  const handlePhoneChange = (value) => {
    const allowedCodes = ["+1", "+1787", "+1939"];
    const fullNumber = countryCode + value;
    const isValid = allowedCodes.some((code) => fullNumber.startsWith(code));

    if (!isValid) {
      setPhoneError(
        "Please use a USA (+1) or Puerto Rico (+1787 or +1939) area code."
      );
    } else {
      setPhoneError("");
    }

    return value;
  };

  const onSubmit = async (values) => {
    setLoading(true);

    console.log("values:", values);
    try {
      // Format phone with country code
      const formattedValues = {
        ...values,
        phone: values.phone ? countryCode + values.phone : "",
      };

      if (userId) {
        // Update existing user
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/update/${userId}`,
          formattedValues
        );

        toast.success("User updated successfully");
      } else {
        // Create new user
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/add/user`,
          formattedValues
        );

        toast.success("User added successfully");
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
      setUserId("");
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
    setUserId("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state);
        setUserId("");
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[98vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-full">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {userId ? "Edit User" : "Add New User"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {userId
                    ? "Update user information"
                    : "Create a new user account"}
                </DialogDescription>
              </div>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        {fetchingUser ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2 text-muted-foreground">
              Loading user data...
            </span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger
                    value="basic"
                    className="flex items-center gap-1"
                  >
                    <User className="h-4 w-4" />
                    <span>Basic Info</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="flex items-center gap-1"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Details</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="flex items-center gap-1"
                  >
                    <UserCog className="h-4 w-4" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Full Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example@email.com"
                              {...field}
                              readOnly={!!userId}
                              className={
                                userId ? "bg-muted cursor-not-allowed" : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!userId && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Password <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="userName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="col-span-1 sm:col-span-2">
                          <FormLabel>Phone</FormLabel>
                          <div className="flex gap-2">
                            <Select
                              value={countryCode}
                              onValueChange={setCountryCode}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="+1">+1 (USA)</SelectItem>
                                <SelectItem value="+1787">
                                  +1787 (PR)
                                </SelectItem>
                                <SelectItem value="+1939">
                                  +1939 (PR)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormControl>
                              <Input
                                placeholder="Phone number"
                                {...field}
                                onChange={(e) => {
                                  const value = handlePhoneChange(
                                    e.target.value
                                  );
                                  field.onChange(value);
                                }}
                                className="flex-1"
                              />
                            </FormControl>
                          </div>
                          {phoneError && (
                            <p className="text-sm text-red-500 mt-1">
                              {phoneError}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-1 sm:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main St, City, State"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vessel_Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vessel Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Sea Explorer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="points"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            Reward points accumulated by the user
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rank</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            User&apos;s position in the leaderboard
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>User Role</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="bg-red-100 text-red-800 border-red-200"
                                      >
                                        Admin
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Full system access
                                      </span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="moderator">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-100 text-blue-800 border-blue-200"
                                      >
                                        Moderator
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Content management
                                      </span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="user">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-800 border-green-200"
                                      >
                                        User
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Standard access
                                      </span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="member">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="bg-purple-100 text-purple-800 border-purple-200"
                                      >
                                        Member
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        Basic access
                                      </span>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {userId && (
                          <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Account Status
                                  </FormLabel>
                                  <FormDescription>
                                    {field.value
                                      ? "User account is active"
                                      : "User account is inactive"}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center">
                  {userId && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-orange-100">
                        <AvatarFallback className="text-orange-600">
                          {form.getValues().name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{form.getValues().name}</p>
                        <p className="text-muted-foreground">
                          {form.getValues().email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {userId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {userId ? "Update User" : "Create User"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
