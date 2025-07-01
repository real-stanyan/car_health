"use client";

// import React
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// import icons
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
  AlignRight,
  Car,
  Plus,
  ChevronRight,
  Database,
} from "lucide-react";

// import shadcn ui
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// import Components
import { useGlobalContext } from "@/components/GlobalContextProvider";

// import firebase
import { auth, provider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
];

const DatabaseItems = [
  {
    title: "Files",
    url: "/files",
    icon: Database,
  },
];

export function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const { car, setCar } = useGlobalContext();
  const { currentCar, setcurrentCar } = useGlobalContext();

  console.log(currentCar);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await ensureUserDoc(user);
        setUser(user);

        // ✅ 只有 user 存在时才执行
        const garageRef = collection(db, "users_data", user.uid, "garages");
        const snapshot = await getDocs(garageRef);
        const cars = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            brand: data.brand,
            model: data.model,
            year: data.year,
            id: data.createdAt,
          };
        });

        setCar(cars);
      }
    });

    return () => unsubscribe();
  }, []);

  const ensureUserDoc = async (user: User) => {
    const userRef = doc(db, "users_data", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        createdAt: Date.now(),
      });
    }
  };

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("login successfull!");
      return result.user;
    } catch (error: any) {
      console.error(`login error: ${error}`);
      toast.error(`login error: ${error}`);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfull!");
    } catch (error: any) {
      console.error(`sign out error: ${error}`);
      toast.error(`sign out error: ${error}`);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {currentCar.model !== "" ? (
                    <div className="flex justify-start items-center gap-2">
                      <Image
                        src="/images/brand/bmw.webp"
                        width={40}
                        height={40}
                        alt="bmw_logo"
                      />
                      <h1>
                        {currentCar.year} {currentCar.brand} {currentCar.model}
                      </h1>
                    </div>
                  ) : car.length !== 0 ? (
                    <div className="flex justify-start items-center gap-2">
                      <Image
                        src="/images/brand/bmw.webp"
                        width={40}
                        height={40}
                        alt="bmw_logo"
                      />
                      <h1>
                        {car[0].year} {car[0].brand} {car[0].model}
                      </h1>
                    </div>
                  ) : (
                    <h1>No car in your garage</h1>
                  )}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                {car &&
                  car.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setcurrentCar(item)}
                    >
                      <div className="flex justify-between items-center w-full h-full">
                        <div className="flex justify-start items-center gap-2">
                          <Image
                            src="/images/brand/bmw.webp"
                            width={40}
                            height={40}
                            alt="bmw_logo"
                          />
                          <span className="text-black font-bold text-xs whitespace-nowrap">
                            {item.year} {item.brand} {item.model}
                          </span>
                        </div>
                        <div>
                          <ChevronRight className="text-black !w-[20px] !h-[20px]" />
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}

                {/* add car */}
                <DropdownMenuItem>
                  <Link
                    href="/addcar"
                    className="flex justify-between items-center w-full h-full"
                  >
                    <div className="flex justify-start items-center gap-2">
                      <Car className="text-black !w-[40px] !h-[40px]" />
                      <span className="text-black font-bold">Add Car</span>
                    </div>
                    <div>
                      <Plus className="text-black !w-[20px] !h-[20px]" />
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Database</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DatabaseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              {user ? (
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={user.photoURL as string}
                        width={32}
                        height={32}
                        alt="user avatar"
                        className="object-cover"
                      />
                    </div>
                    {user.displayName}
                    <AlignRight className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              ) : (
                <SidebarMenuButton onClick={login}>
                  <Car /> log in
                </SidebarMenuButton>
              )}

              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {/* <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem> */}
                {/* sign out button */}
                <AlertDialog>
                  <AlertDialogTrigger className="w-full text-center">
                    Sign out
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Continue to sign out?</AlertDialogTitle>
                      {/* <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription> */}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={logout}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
