"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun, Search, User, User2Icon } from "lucide-react";

import Logo from "@/public/Logo.svg";
import { Input } from "@/components/ui/input";
import { IoCartOutline } from "react-icons/io5";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [userInitial, setUserInitial] = useState<string>("");

  useEffect(() => {
    console.log(user);
    setUserLoading(true);
    if (user) {
      setUserInitial(user.user.charAt(0).toUpperCase());
    } else {
      setUserInitial("");
    }
    setUserLoading(false);
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-black bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pl-0 pr-0 sm:pl-20 sm:pr-20">
      <div className="flex w-full h-15 items-center">
        <Link href="/">
          <Image
            src={Logo}
            width={80}
            height={80}
            alt="Picture of the author"
            className="cursor-pointer flex-1"
          />
        </Link>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder="Search Products"
            className="focus-visible:border-[var(--site-primary)] focus-visible:ring-[var(--site-primary)] focus-visible:ring-[1px] pl-10"
          />
        </div>

        <nav className="flex items-center space-x-6 ml-auto pl-5 pr-5">
          <CustomTooltip
            triggerContent={
              <IoCartOutline
                className="h-5 w-5 cursor-pointer"
                onClick={() => router.push("/cart")}
              />
            }
            message={<p>Check your cart</p>}
          />
          <div onClick={toggleTheme} className="flex">
            {theme === "dark" ? (
              <CustomTooltip
                triggerContent={<Sun size={18} className="cursor-pointer" />}
                message={<p>Light Mode</p>}
              />
            ) : (
              <CustomTooltip
                triggerContent={<Moon size={18} className="cursor-pointer" />}
                message={<p>Dark Mode</p>}
              />
            )}
          </div>
          <div>
            {userLoading ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : userInitial ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="flex items-center space-x-2">
                    <User2Icon />
                    <p>{user?.user}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="cursor-pointer"
                onClick={() => router.push("/login")}
              >
                <User /> User Login
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
