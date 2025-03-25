"use client";

import * as React from "react";
import { LayoutDashboard, ClipboardList, LogOut } from "lucide-react";

import { NavMain } from "@/components/navMain";
import { NavUser } from "@/components/navUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Pokemon Search",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "AI",
      url: "/ai",
      icon: ClipboardList,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  function handleLogout() {
    router.push("/");
  }

  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter style={{ paddingBottom: 20 }}>
        <Button onClick={handleLogout} variant={"destructive"}>
          {open ? "Logout" : <LogOut />}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
