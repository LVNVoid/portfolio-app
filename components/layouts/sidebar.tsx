"use client";

import { FileText, Home, Users, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navigationItems = [
  {
    title: "Beranda",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Portofolio",
    icon: FileText,
    href: "/portfolio",
  },
  {
    title: "Data Pengguna",
    icon: Users,
    href: "/users",
  },
  {
    title: "Profil",
    icon: User,
    href: "/profile",
  },
];

type SidebarProps = {
  role?: string | null;
  className?: string;
};

const Sidebar = ({ role, className = "" }: SidebarProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") return true;
    if (href !== "/dashboard")
      return pathname === href || pathname?.startsWith(`${href}/`);
    return false;
  };

  const filteredItems = navigationItems.filter((item) => {
    if (role === "mahasiswa" && item.href === "/users") return false;
    return true;
  });

  if (!mounted) return null;
  return (
    <div
      className={cn(
        "h-full flex flex-col bg-background border-r shadow-sm",
        className
      )}
    >
      {/* Logo and Brand */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-accent text-accent-foreground font-bold text-xl">
            EP
          </div>
          <h2 className="text-xl font-semibold tracking-tight">E-Portfolio</h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center gap-3 my-4 rounded-md px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                    isItemActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isItemActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
