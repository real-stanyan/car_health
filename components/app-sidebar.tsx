"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronDown,
  AlignRight,
} from "lucide-react";
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
import { Car, Plus } from "lucide-react";
import Link from "next/link";
import { useGlobalContext } from "@/components/GlobalContextProvider";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const { car, setCar } = useGlobalContext();

  console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {car.length !== 0 ? (
                    <h1>
                      {car[0].brand} | {car[0].model}
                    </h1>
                  ) : (
                    <h1>No car in your garage</h1>
                  )}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuItem>
                  <Link
                    href="/addcar"
                    className="flex justify-between items-center w-full h-full"
                  >
                    <div className="flex justify-start items-center gap-2">
                      <Car className="text-black !w-[30px] !h-[30px]" />
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
                <DropdownMenuItem onClick={logout}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
